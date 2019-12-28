'use strict';

const model = require('../model/model.js');
const r = require('thinkagain')().r;

module.exports = {
    createEvent,
    readEvent,
    readEvents,
    updateEvent,
    deleteEvent
};

function createEvent(req, res, next) {
    r.db('Schedule').table('Event').insert(
            req.swagger.params.event.value, {returnChanges: true}
        ).run().then(
        function (result) {
            res.json(get_new(result));
        }
    );
}

function readEvent(req, res, next) {
    r.db('Schedule').table('Event')
        .get(req.swagger.params.id.value)
        .run().then(
        function (result) {
            res.json(result);
        }
    );
}

function readEvents(req, res, next) {
    r.db('Schedule').table('Event')
        .run().then(
        function (result) {
            res.json(result);
        }
    );
}

function updateEvent(req, res, next) {
    r.db('Schedule').table('Event').get(req.swagger.params.id.value)
        .update(req.swagger.params.event.value, {returnChanges: true})
        .run().then(
        function (result) {
            res.json(get_new(result));
        }
    );
}

function deleteEvent(req, res, next) {
    r.db('Schedule').table('Event')
        .get(req.swagger.params.id.value).delete({returnChanges: true})
        .run().then(
        function (result) {
            res.json(get_old(result));
        }
    );
}

function get_new(result) {
    if (result.changes.length > 0) if (result.changes[0].new_val != null) return result.changes[0].new_val;
    return result;
}

function get_old(result) {
    if (result.changes.length > 0) if (result.changes[0].old_val != null) return result.changes[0].old_val;
    return result;
}
