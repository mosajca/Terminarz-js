'use strict';

var app = require('express')();
module.exports = app; // for testing

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/script.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});
app.get('/templates/:name', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'templates', req.params.name));
});
app.get('/angular-material.min.css', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-material', 'angular-material.min.css'));
});
app.get('/angular.min.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular', 'angular.min.js'));
});
app.get('/angular-animate.min.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-animate', 'angular-animate.min.js'));
});
app.get('/angular-aria.min.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-aria', 'angular-aria.min.js'));
});
app.get('/angular-material.min.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'node_modules', 'angular-material', 'angular-material.min.js'));
});

var session = require('express-session');
var MemoryStore = require('memorystore')(session);
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET || 'test secret',
  store: new MemoryStore({checkPeriod: 86400000}),
  unset: 'destroy'
}));

var SwaggerExpress = require('swagger-express-mw');
var config = {
  appRoot: __dirname // required config
};
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 10010;
  app.listen(port);
});
