'use strict';

const bcrypt = require('bcryptjs');
const r = require('thinkagain')().r;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

module.exports = {
    registerUser,
    readUser,
    updateUser,
    deleteUser
};

function registerUser(req, res) {
    const userData = req.swagger.params.user.value;
    r.db('Schedule').table('User').get(userData.name).run().then(function (user) {
        if (user) {
            res.status(400).json({ message: 'Użytkownik o podanej nazwie istnieje.' });
        } else if (!passwordRegex.test(userData.password)) {
            res.status(400).json({
                message: 'Hasło nie spełnia wymagań. ' +
                    'Musi mieć co najmniej 8 znaków długości, a także zawierać co najmniej: ' +
                    'jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak spośród !@#$%^&*.'
            });
        } else {
            bcrypt.hash(userData.password, 10, function (err, hash) {
                if (err) {
                    res.status(500).json();
                } else {
                    userData.password = hash;
                    r.db('Schedule').table('User').insert(userData).run().then(function (result) {
                        if (result.inserted) {
                            res.status(201).json();
                        } else {
                            res.status(500).json();
                        }
                    }).catch(function (error) {
                        res.status(500).json();
                    });
                }
            });
        }
    }).catch(function (error) {
        res.status(500).json();
    });
}

function readUser(req, res) {
    const user = req.authenticatedUser;
    const userId = req.swagger.params.id.value;
    if (!user) {
        res.status(401).json();
    } else if (user.name !== userId) {
        res.status(403).json();
    } else {
        res.status(200).json({name: userId});
    }
}

function updateUser(req, res) {
    const user = req.authenticatedUser;
    const userId = req.swagger.params.id.value;
    const newPassword = req.swagger.params.user.value.password;
    if (!user) {
        res.status(401).json();
    } else if (user.name !== userId) {
        res.status(403).json();
    } else if (!passwordRegex.test(newPassword)) {
        res.status(400).json({
            message: 'Hasło nie spełnia wymagań. ' +
                'Musi mieć co najmniej 8 znaków długości, a także zawierać co najmniej: ' +
                'jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak spośród !@#$%^&*.'
        });
    } else {
        bcrypt.hash(newPassword, 10, function (err, hash) {
            if (err) {
                res.status(500).json();
            } else {
                r.db('Schedule').table('User').get(userId).update({ password: hash }).run().then(function (result) {
                    if (result.replaced) {
                        res.status(200).json();
                    } else {
                        res.status(500).json();
                    }
                }).catch(function (error) {
                    res.status(500).json();
                });
            }
        });
    }
}

function deleteUser(req, res) {
    const user = req.authenticatedUser;
    const userId = req.swagger.params.id.value;
    if (!user) {
        res.status(401).json();
    } else if (user.name !== userId) {
        res.status(403).json();
    } else {
        r.expr([
            r.db('Schedule').table('Event').filter({ userName: userId }).delete(),
            r.db('Schedule').table('User').get(userId).delete()
        ]).run().then(function (result) {
            if (result[1].deleted) {
                res.status(200).json();
            } else {
                res.status(500).json();
            }
        }).catch(function (error) {
            res.status(500).json();
        });
    }
}
