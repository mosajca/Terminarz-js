'use strict';

const r = require('thinkagain')().r;

module.exports = {
    createEvent,
    readEvent,
    readEvents,
    updateEvent,
    deleteEvent
};

function createEvent(req, res) {
    const user = req.authenticatedUser;
    if (!user) {
        res.status(401).json();
    } else {
        const value = req.swagger.params.event.value;
        value.userName = user.name;
        r.db('Schedule').table('Event').insert(value, { returnChanges: true }).run().then(function (result) {
            res.status(201).json(get_new(result));
        }).catch(function (error) {
            res.status(500).json();
        });
    }
}

function readEvent(req, res) {
    const user = req.authenticatedUser ? req.authenticatedUser : {};
    r.db('Schedule').table('Event').get(req.swagger.params.id.value).run().then(function (result) {
        if (result) {
            if (result.public || result.userName === user.name) {
                res.status(200).json(result);
            } else {
                res.status(403).json();
            }
        } else {
            res.status(404).json();
        }
    }).catch(function (error) {
        res.status(500).json();
    });
}

function readEvents(req, res) {
    const user = req.authenticatedUser;
    const vis = req.swagger.params.visibility;

    const epochTime = req.swagger.params.time.value - new Date().getTimezoneOffset() * 60;
    const during = (r.ISO8601(r.row('startDateTime')).lt(r.epochTime(epochTime + 86400)))
        .and(r.ISO8601(r.row('endDateTime')).gt(r.epochTime(epochTime)));

    if (!user) {
        r.db('Schedule').table('Event').filter(during.and(r.row('public').eq(true))).run().then(function (result) {
            res.status(200).json(result);
        }).catch(function (error) {
            res.status(500).json();
        });
    } else {
        const v = vis ? vis.value : 0;
        const publicEvents = r.row('public').eq(true);
        const privateEvents = r.row('public').eq(false);
        const userEvents = r.row('userName').eq(user.name);
        const otherEvents = r.row('userName').ne(user.name);

        let visibility = r.not(true);
        if (v == 1) {
            visibility = publicEvents.and(otherEvents);
        } else if (v == 2) {
            visibility = publicEvents.and(userEvents);
        } else if (v == 3) {
            visibility = publicEvents;
        } else if (v == 4) {
            visibility = privateEvents.and(userEvents);
        } else if (v == 5) {
            visibility = (publicEvents.and(otherEvents)).or(privateEvents.and(userEvents));
        } else if (v == 6) {
            visibility = userEvents;
        } else if (v == 7) {
            visibility = userEvents.or(publicEvents.and(otherEvents));
        }

        r.db('Schedule').table('Event').filter(visibility.and(during)).run().then(function (result) {
            res.status(200).json(result);
        }).catch(function (error) {
            res.status(500).json();
        });
    }
}

function updateEvent(req, res) {
    const user = req.authenticatedUser;
    const event = req.swagger.params.event.value;
    const eventId = req.swagger.params.id.value;
    if (!user) {
        res.status(403).json();
    } else {
        event.userName = user.name;
        r.db('Schedule').table('Event').get(eventId).run().then(function (result) {
            if (result) {
                if (result.userName === user.name) {
                    r.db('Schedule').table('Event').get(eventId).update(event, { returnChanges: true }).run()
                    .then(function (result) {
                        res.status(200).json(get_new(result));
                    }).catch(function (error) {
                        res.status(500).json();
                    });
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json();
            }
        }).catch(function (error) {
            res.status(500).json();
        });
    }
}

function deleteEvent(req, res) {
    const user = req.authenticatedUser;
    const eventId = req.swagger.params.id.value;
    if (!user) {
        res.status(403).json();
    } else {
        r.db('Schedule').table('Event').get(eventId).run().then(function (result) {
            if (result) {
                if (result.userName === user.name) {
                    r.db('Schedule').table('Event').get(eventId).delete({ returnChanges: true }).run()
                    .then(function (result) {
                        res.status(200).json(get_old(result));
                    }).catch(function (error) {
                        res.status(500).json();
                    });
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json();
            }
        }).catch(function (error) {
            res.status(500).json();
        });
    }
}

function get_new(result) {
    if (result.changes.length > 0) if (result.changes[0].new_val != null) return result.changes[0].new_val;
    return result;
}

function get_old(result) {
    if (result.changes.length > 0) if (result.changes[0].old_val != null) return result.changes[0].old_val;
    return result;
}
