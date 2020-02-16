'use strict';

var app = require('express')();
module.exports = app; // for testing

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/script.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});
app.get('/templates/:name', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'templates', req.params.name));
});
app.get('/angular-material.min.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-material', 'angular-material.min.css'));
});
app.get('/angular.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular', 'angular.min.js'));
});
app.get('/angular-animate.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-animate', 'angular-animate.min.js'));
});
app.get('/angular-aria.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-aria', 'angular-aria.min.js'));
});
app.get('/angular-material.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-material', 'angular-material.min.js'));
});

var auth = require('basic-auth');
var bcrypt = require('bcryptjs');
var r = require('thinkagain')().r;
app.use(async function (req, res, next) {
    try {
        const authData = auth(req);
        if (authData) {
            const user = await r.db('Schedule').table('User').get(authData.name).run();
            if (user) {
                const match = await bcrypt.compare(authData.pass, user.password);
                if (match) {
                    req.authenticatedUser = { name: user.name };
                }
            }
        }
        next();
    } catch (error) {
        next();
    }
});

var SwaggerExpress = require('swagger-express-mw');
var config = {
    appRoot: __dirname // required config
};
SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) { throw err; }
    // install middleware
    swaggerExpress.register(app);
    var port = process.env.PORT || 10010;
    app.listen(port);
});
