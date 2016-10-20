var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timers = require('timers');

var basepath = require('./config.json').ui.basePath || '/';

// Routes
var routes = require('./routes/index');
var status = require('./routes/status');
var middleware = require('./routes/middleware');
var start = require('./routes/start');
var restart = require('./routes/restart');

// Background Processes
var empty = require('./background/empty');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(basepath, express.static(path.join(__dirname, 'public')));

// Routes
app.use(basepath, middleware);
app.use(basepath, routes);
app.use(basepath + '/status', status);
app.use(basepath + '/start', start);
app.use(basepath + '/restart', restart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500);
    res.json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.messagge);
  res.status(err.status || 500);
  res.send(err.message);
});

timers.setTimeout(empty, 60000);

module.exports = app;
