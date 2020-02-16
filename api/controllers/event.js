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
        r.db('Schedule').table('Event').insert(
                value, {returnChanges: true}
            ).run().then(
            function (result) {
                res.json(get_new(result));
            }
        ).catch(function (error) {
            res.status(500).json();
        });
    }
}

function readEvent(req, res) {
    const user = req.authenticatedUser;
    r.db('Schedule').table('Event')
        .get(req.swagger.params.id.value)
        .run().then(function (result) {
            if (result) {
                if (result.public || result.userName === user.name) {
                    res.json(result);
                } else {
                    res.status(403).json();
                }
            } else {
                res.status(404).json();
            }
        }
    ).catch(function (error) {
        res.status(500).json();
    });
}

function readEvents(req, res) {
    const query = req.query;
    if (query.time) {
        console.log(query.time);
    }
    if (query.visibility) {
        console.log(query.visibility);
    }
    r.db('Schedule').table('Event')
        .run().then(
        function (result) {
            res.json(result);
        }
    );
}

function updateEvent(req, res) {
    const user = req.authenticatedUser;
    const event = req.swagger.params.event.value;
    const eventId = req.swagger.params.id.value;
    event.userName = user.name;
    if(!user) {
        res.status(403).json();
    } else {
        r.db('Schedule').table('Event').get(eventId).run()
            .then(function (result) {
                if (result) {
                    if (result.userName === user.name) {
                        r.db('Schedule').table('Event').get(eventId)
                        .update(event, {returnChanges: true})
                        .run().then(
                            function (result) {
                                res.json(get_new(result));
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
    r.db('Schedule').table('Event').get(eventId).run().then(function (result) {
        if (result) {
            if (result.userName === user.name) {
                r.db('Schedule').table('Event').get(eventId).delete({returnChanges: true})
                    .run().then(function (result) {
                        res.json(get_old(result));
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

function get_new(result) {
    if (result.changes.length > 0) if (result.changes[0].new_val != null) return result.changes[0].new_val;
    return result;
}

function get_old(result) {
    if (result.changes.length > 0) if (result.changes[0].old_val != null) return result.changes[0].old_val;
    return result;
}
