"use strict";
var User       = require('../proxys/user');
var logger     = require('../common/logger');
var config     = require('../config/config');
var tools      = require('../common/tools');
var eventproxy = require('eventproxy');
var userForm   = require('../forms/user');

exports.changeBlock = function (req, res, next) {

};

exports.getDetail = function (req, res, next) {

};

exports.addUser = function(req, res, next) {
  req.body.password = "121212";
  var form  = userForm(req.body);
  form.addUser();
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
        "message": "抱歉, 该邮箱已经被使用"
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
      ep.emit('save user');
    }));
  });

  ep.on('save user', function(){
    var pass = form.cleaned_data.password;
    tools.bhash(pass, ep.done(function(pass_hash){
      form.cleaned_data.password = pass_hash;
      User.createUser(form.cleaned_data, function(err){
        if(err){
          logger.fatal('creat user error --> ', err);
          return next(err);
        }
        res.status(200).json({
          "message": "成功"
        });
      });
    }));
  });
};

exports.deleteUser = function (req, res, next) {
  var wh           = { id: req.body.id };
  var session_user = req.session.user;

  User.deleteUser(session_user, wh, function(err, user){
    if(err) {
      return res.status(422).json({
        "message": "删除失败"
      });
    }

    return res.status(200).json({
      "message": "删除成功"
    });
  });
};

exports.update = function (req, res, next) {
  var session_user = req.session.user;
  var form = userForm(req.body);
  form.update();
  if(!form.is_valid) {
    return res.status(403).json(form.error);
  }

  if(!session_user) {
    return res.status(403).json({
      "message": "更改失败"
    });
  }

  User.getUserById(form.data.id, function(err, user) {
    if(err) {
      logger.fatal("user update: --> ", JSON.stringify(err));
      return res.status(422).json({
        "message": "抱歉，操作失败"
      });
    }

    if(!user) {
      return res.status(404).json({
        "message": "未找到该用户"
      });
    }

    if(session_user.status === config.status.is_admin) {
      form.cleaned_data.status = req.body.status;
      form.cleaned_data.money = req.body.money;
      form.cleaned_data.gender = req.body.gender;
    }

    User.updateUser(user, form.cleaned_data, function(err) {
      if(err) {
        logger.fatal("user updateUser: --> ", JSON.stringify(err));
        return res.status(422).json({
          "message": "操作失败"
        });
      }

      return res.status(200).json({
        "message": "修改成功"
      });
    });
  });
};

exports.getUser = function (req, res, next) {
  var session_user = req.session.user;

  User.getUserById(session_user.id, function(err, user) {
    if(err) {
      logger.fatal("getUser --> ", JSON.stringify(err));
    }
    if(!user) {
      return res.status(404).json({
        "message": "未找到用户"
      });
    }

    return res.status(200).json({
      "message": "成功",
      "user": User.getUserInfo(session_user, user)
    });
  });

};

exports.getUsers = function(req, res, next) {
  var session_user = req.session.user;
  var opt = { 
    where: {
      status: { $gte: 0}
    }
  };
  User.getUsersByQuery(session_user, '', opt, function(err, users){
    return res.status(200).json({
      "message": "成功",
      "data": users
    });
  });
}

exports.getReplyHistory = function (req, res, next) {

};
