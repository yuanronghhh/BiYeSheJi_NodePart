var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var morgan       = require('morgan');
var http         = require('http');

var route        = require('./router/web_router');
var config       = require('./config/config');

var app          = express();

app.set('x-powered-by', false);
app.set('trust proxy', ['loopback']);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));

app.use(express.static(path.join(__dirname, 'views/static')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

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
  res.json({
    message: err.message,
    error: {}
  });
});

if(!module.parent){
  app.listen(config.port);
  console.log('listening ' + config.port);
}

module.exports = app;
