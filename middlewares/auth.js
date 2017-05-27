"use strict";
var config      = require('../config/config');
var eventproxy  = require('eventproxy');
var debug       = require('debug')("middlewares:auth");
var User        = require('../proxys/user');

exports.genCookie = function(user, res){
  var auth_token = user.id + '$$$$';
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 1, //1天
    signed: true,
    httpOnly: false
  };
  res.cookie(config.auth_cookie_name, auth_token, opts);
};

exports.userRequired = function(req, res, next){
  if(!req.session.user){
    return res.status(403).json({
      "message": "对不起请登录"
    });
  }

  next();
};

exports.adminRequired = function(req, res, next){
  if(req.session.user && req.session.user.status === config.status.is_admin){
    return next();
  }
  return res.status(403).json({
    "message": "对不起, 您不是管理员!"
  });
};

exports.authUser = function(req, res, next){
  var ep           = new eventproxy();

  ep.fail(next);

  res.locals.user = null;

  ep.all('getUser', function(user){
    if(!user){
      return next();
    }
    var session_user = res.locals.user = req.session.user = user;
    if(!session_user.images) {
      session_user.images = [];
    }
    if(config.admins.hasOwnProperty(user.login_name)){
      session_user.status = config.status.is_admin;
    }
    return next();
  });

  if(req.session.user){
    ep.emit('getUser', req.session.user);
  } else {
    var authCode = req.signedCookies[config.auth_cookie_name];
    if(!authCode){
      return next();
    }

    var auth    = authCode.split('$$$$');
    var user_id = auth[0];
    User.getUserById(user_id, ep.done('getUser'));
  }
};

exports.userAuthened = function(req, res, next){
  if(!req.session.user){
    res.status(403).json({
      "message": "抱歉，请登录"
    });
    return;
  }
  if(!req.session.user.authened){
    res.status(403).json({
      "message": "请认证后操作"
    });
    return;
  }
  return next();
};

exports.blocked = function(req, res ,next){
  if (req.path === '/signout') {
    return next();
  }

  if(req.session.user && req.session.user.status === config.status.blocked){
    res.status(403).json({
      "message":'抱歉，您已经被锁定'
    });
    return;
  }
  return next();
};

exports.isPCBrowser = function(req, res, next){
  var deviceAgent = req.headers["user-agent"];
  var agentID = deviceAgent.match(/(iPhone|iPod|iPad|Android)/);
  if(agentID && agentID !== ''){
    return res.status(403).json({
      "message":'请使用电脑端浏览器登录!'
    });
  }

  return next();
};
