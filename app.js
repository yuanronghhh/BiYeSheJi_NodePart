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


// 允许跨域请求, 并带Cookie验证
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.set('trust proxy', ['loopback']);
app.use(morgan('dev'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));

app.use(express.static(path.join(__dirname, '../page/dist/')));
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
    if(config.debug) {
      res.status(500).json({
        err: err.message
      });
    } else {
      logger.fatal("err: --> ", err.message);
      res.status(500).end();
    }
  }
  next(err);
});

app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  res.status(err.status);
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
