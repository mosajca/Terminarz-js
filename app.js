'use strict';

var app = require('express')();
module.exports = app; // for testing

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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
