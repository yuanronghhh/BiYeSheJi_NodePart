var config      = require('../config/config');
var models      = require('../models');
var UserModel   = models.User;

exports.gen_session = function (user, res){
  var auth_token = user._id + '$';
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30, //30天
    signed: true,
    httpOnly: false
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); 
};

