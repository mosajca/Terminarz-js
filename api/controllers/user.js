'use strict';

const r = require('thinkagain')().r;

module.exports = {
    register,
    updateUser,
    deleteUser
};

function register(req, res, next) {
    r.db('Schedule').table('User').insert(
            req.swagger.params.user.value, {returnChanges: true}
        ).run().then(
        function (result) {
            res.json(get_new(result));
        }
    );
}

function updateUser(req, res, next) {
    r.db('Schedule').table('User').get(req.swagger.params.id.value)
        .update(req.swagger.params.user.value, {returnChanges: true})
        .run().then(
        function (result) {
            res.json(get_new(result));
        }
    );
}

function deleteUser(req, res, next) {
    r.db('Schedule').table('User')
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
