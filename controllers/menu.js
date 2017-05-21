"use strict";
var Menu       = require('../proxys/menu');
var User       = require('../proxys/user');
var logger     = require('../common/logger');
var menuForm   = require('../forms/menu');
var rule       = require("../common/rule");
var eventproxy = require('eventproxy');

var state      = {
  "0": "等待接单",
  "1": "已接单",
  "2": "交易成功",
  "3": "已删除",
  "4": "已经锁定"
}

/**
 * 注意，这里的订单是将数据存为字符串进数据库, 未作校验, 赶时间
 */
exports.createMenu = function (req, res, next) {
  var session_user = req.session.user;
  var form = menuForm(req.body.data || req.query.data);
  form.createMenu();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var ep   = new eventproxy();
  var data = {};

  ep.fail(next);

  User.getUserById(session_user.id, function(err, user) {
    if(err) {
      logger.fatal("createMenu --> ", JSON.stringify(err));
      return;
    }

    Menu.createMenu(user, form.cleaned_data, function(err, message){
      if(message) {
        return res.status(422).json({
          "message": message
        });
      }

      if(err){
        logger.fatal("createMenu: create error --> " + err);

        return res.status(422).json({
          "message": "创建失败!"
        });
      }

      return res.status(200).json({
        "message": "创建成功"
      });
    });
  });
};

/**
 * 获取订单
 */
exports.getMenus = function(req, res, next) {
  var user = req.session.user;

  Menu.getMenus(user, {
    "create_by": user.id
  }, function(err, menus){
    if(err){
      logger.fatal('getMenus: -->' + err);
      return next(err);
    }

    // 将状态转文字
    for(var i = 0; i < menus.length ; i++ ) {
      var m = menus[i];
      menus[i]["status"] = state[m["status"].toString()];
    }

    return res.status(200).json({
      "message": "成功",
      "data": menus
    });
  });
};

exports.getMenu = function(req, res, next) {
  var user = req.session.user;
  Menu.getMenuByName(name, function(err, menu){
    if(err){
      logger.fatal('getMenu: -->' + err);
      return next(err);
    }
    return res.status(200).json(menu);
  });
};

exports.showTip = function(req, res, next){
  var form = menuForm(req.body.data || req.query.data);
  form.showTip();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  var rl = rule(form.cleaned_data);
  return res.status(200).json(rl.info);
};

exports.changeBlock = function (req, res, next) {
  var form = menuForm(req.body || req.query);

};

exports.activeMenu = function (req, res, next) {

};

exports.hotMenus = function (req, res, next) {

};

exports.deleteMenu = function (req, res, next) {

};

exports.deleteMenus = function (req, res, next) {

};

exports.updateMenu = function (req, res, next) {

};

exports.updateMenu = function (req, res, next) {

};

exports.changeBlock = function (req, res, next) {

};
