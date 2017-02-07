"use strict";
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var morgan       = require('morgan');
var http         = require('http');

var route        = require('./router/web_router');
var config       = require('./config/config');
var auth         = require('./middlewares/auth');
var logger       = require('./common/logger');

var app          = express();

app.set('trust proxy', ['loopback']);
app.use(morgan('dev'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));

app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.session_secret,
}));

// app.use(auth.isPhoneBrowser);
app.use(auth.authUser);
app.use(auth.blocked);
app.use('/', route);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  if (req.xhr){
    res.status(500).json({
      err: err.message
    });
  }
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(err.status === 500) {
    logger.fatal("err: --> " + err.message);
  }
  res.json({
    message: err.message,
    error: err
  });
});

if(!module.parent){
  app.listen(config.port);
  console.log('listening ' + config.port);
}

module.exports = app;
