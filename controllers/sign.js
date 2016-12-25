var eventproxy     = require('eventproxy');
var validator      = require('validator');
var path           = require('path');
var ejs            = require('ejs');
var fs             = require('fs');
var auth           = require('../middlewares/auth');
var config         = require('../config/config');
var signForm       = require('../forms/sign');
var User           = require('../proxys/user');
var logger         = require('../common/logger');
var preEmail       = require('../common/pre_email');
var mail           = require('../common/mail');
var tools          = require('../common/tools');

exports.reActive = function(req, res, next){
  var form = signForm(req.body);
  form.reActive();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  var email = form.cleaned_data.email;
  User.getUserByEmail(email, function(err, user){
    if(err) {
      logger.fatal('cannot reactive a user');
      return next(err);
    }
    if(!user){
      logger.warn('cannot reactive a user');
      return res.status(404).json({
        "message": "无法找到该账户, 不能重新激活"
      });
    }

    preEmail.preActiveEmail(form, next, function(info){
      var has_send = mail.sendEmail(info.email, info.content);
      if(!has_send){
        return res.status(404).json({
          "message": "网络暂时不稳定, 请稍后重试。"
        });
      }
      return res.status(200).json({
        "message": "已经成功发送邮件, 请注意查收!"
      });
    });
  });

};

exports.signup = function (req, res, next) {
  var form  = signForm(req.body);
  form.signup();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var ep    = new eventproxy();
  var email = form.cleaned_data.email;
  var name  = form.cleaned_data.name;
  ep.fail(next);

  User.getUserByEmail(email, ep.done(function(user){
    if(user){
      return res.status(422).json({
        "message": "抱歉, 该邮箱已经被注册"
      });
    }
    ep.emit('check name');
  }));

  ep.on('check name', function(){
    User.getUserByName(name, ep.done(function(user){
      if(user){
        return res.status(422).json({
          "message": "抱歉, 该用户名已经被注册"
        });
      }
      ep.emit('checked');
    }));
  });

  preEmail.preActiveEmail(form, next, function(info){
    ep.emit('send email', info.email, info.content);
  });

  ep.all(['send email', 'checked'], function(email, content){
    mail.sendEmail(email, content);
    ep.emit('save user');
  });

  ep.on('save user', function(){
    var pass = form.cleaned_data.password;
    tools.bhash(pass, ep.done(function(passhash){
      form.cleaned_data.password = passhash;
      User.createUser(form.cleaned_data, function(err){
        if(err){
          logger.fatal('creat user error');
          return next(err);
        }
        res.status(200).json({
          "message": "您好，激活邮件已经发生到您的邮箱，请确认后注册"
        });
      });
    }));
  });

};

exports.login = function(req, res, next) {
  var form  = signForm(req.body);
  form.login();
  if(!form.is_valid){
    res.status(403).json(form.error);
    return ;
  }

  var account, LoginMethod;
  var password = form.cleaned_data.password;
  var ep       = new eventproxy();

  if(form.cleaned_data.hasOwnProperty('email')){
    account = form.cleaned_data.email;
    LoginMethod  = User.getUserByEmail;
  } else {
    account = form.cleaned_data.name;
    LoginMethod = User.getUserByName;
  }

  ep.fail(next);

  LoginMethod(account, function(err, user){
    if(err) {
      logger.fatal('user find error');
      return next(err);
    }
    if(!user){
      logger.warn('cannot find user');
      res.status(422).json({
        "message": "抱歉, 用户不存在"
      });
    } else {
      ep.emit('check user', '', user);
    }
  });

  ep.on('check user', ep.done(function(user){
    var passhash = user.password;
    tools.bcompare(password, passhash, function(err, bool) {
      if(err) {
        logger.error('compare pass error');
        return next(err);
      }
      if (!bool) {
        return res.status(422).json({
          "message": "账号或密码错误"
        });
      }
      if(User.checkBlock(user)){
        res.status(422).json({
          "message":'抱歉,账户未激活'
        });
      } else {
        ep.emit('gen cookie', user);
      }
    });
  }));

  ep.on('gen cookie', function(user){
    auth.genCookie(user, res);
    return res.status(200).json({
      "message":'登录成功'
    });
  });

};

exports.activeUser = function(req, res, next){
  var form = signForm(req.query);
  form.activeUser();
  if(!form.is_valid){
    res.status(403).json(form.error);
    return ;
  }

  var ep         = new eventproxy();
  var email      = form.cleaned_data.email;
  var active_key = form.cleaned_data.active_key;
  var create_at  = form.cleaned_data.create_at;
  var delta      = config.active_out_delta;

  ep.fail(next);

  if(tools.isOutOfDate(create_at, delta)){
    return res.status(422).json({
      "message": "抱歉, 您的链接已经过期"
    });
  }

  tools.bcompare(email, active_key, ep.done(function(bool){
    if(!bool){
      return res.status(422).json({
        "message": "抱歉, 操作失败"
      });
    }
    ep.emit("get user", '', email);
  }));

  ep.on('get user', ep.done(function(email){
    User.getUserByEmail(email, ep.done(function(user){
      if(!user){
        return res.status(404).json({
          "message": "未找到用户信息"
        });
      }
      if(user.status){
        return res.status(422).json({
          "message": "您好, 用户账号已经激活"
        });
      }
      ep.emit('active user', '', user);
    }));
  }));

  ep.on('active user', ep.done(function(user){
    User.activeUser(user, ep.done(function(){
      return res.status(200).json({
        "message": "恭喜,账号已经激活成功"
      });
    }));
  }));

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
