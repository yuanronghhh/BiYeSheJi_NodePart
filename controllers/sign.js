var eventproxy     = require('eventproxy');
var validator      = require('validator');
var config         = require('../config/config');
var signForm       = require("../common/sign");

exports.signup = function (req, res, next) {
  var form  = signForm(req.body);
  form.signup();
  if(!form.is_valid){
    res.status(403).json(form.error);
    return ;
  }
  res.end("注册成功");
};

exports.login = function(req, res, next) {
  var form  = signForm(req.body);
  form.login();
  if(!form.is_valid){
    res.status(403).json(form.error);
    return ;
  }

  res.end("登录成功");
};

exports.signOut = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {
    path: '/' 
  });
  res.status(200).json({
    "message": "注销成功"
  });
};

exports.updatePass = function (req, res, next) {
};
