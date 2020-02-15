'use strict';

const r = require('thinkagain')().r;

module.exports = {
    createUser,
    readUser,
    readUsers,
    updateUser,
    deleteUser,
    logout,
    user
};

function user(req, res, next) {
    if(req.session == null) {
        res.json({
            name: null,
            id: null
        });
    } else {
        res.json({
            name: req.session.userName,
            id: req.session.userId
        });
    }
}

function logout(req, res, next) {
    req.session = null;
    res.json('logout');
}

function createUser(req, res, next) {
    r.db('Schedule').table('User').insert(
            req.swagger.params.user.value, {returnChanges: true}
        ).run().then(
        function (result) {
            res.json(get_new(result));
        }
    );
}

function readUser(req, res, next) {
    r.db('Schedule').table('User')
        .filter({name: req.swagger.params.id.value})
        /*.get(req.swagger.params.id.value)*/
        .run().then(
        function (result) {
            req.session.userId = result[0].id;
            req.session.userName = result[0].name;
            res.json(result[0]);
        }
    );
}

function readUsers(req, res, next) {
    r.db('Schedule').table('User')
        .run().then(
        function (result) {
            res.json(result);
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
