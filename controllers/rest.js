"use strict";
var Rest       = require('../proxys/Rest');
var restForm   = require('../forms/rest');
var eventproxy = require('eventproxy');
var logger     = require('../common/logger');
var debug      = require('debug')("controllers/rest");
var _          = require('lodash');

/**
 * 创建餐厅
 */
exports.createRest = function (req, res, next) {
  var user = req.session.user;
  var form = restForm(req.body);
  var ep   = new eventproxy();
  form.createRest();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  ep.fail(next);

  Rest.getRestById(user.id, function(err, rest) {
    if(rest) {
      logger.warn("createRest: a account only create single rest.");
      return res.status(403).json({
        "message": "抱歉，一个账号只能创建一个餐厅"
      });
    }
    form.cleaned_data = _.merge({
      "user_id": user.id,
    }, form.cleaned_data);

    Rest.createRest(form.cleaned_data, function(err){
      if(err){
        logger.fatal("createRest: create error --> " + err);
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

exports.getRest = function (req, res, next) {
  var user    = req.session.user;
  var form    = restForm(req.params);
  var wh      = {};
  if(req.params.hasOwnProperty("id")) {
    form.getRest();
    wh["id"] = req.params.id;
  }
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  wh["user_id"] = user.id;
  Rest.getRestByQuery(user, wh, function(err, rest){
    debug("getRest: rest --> ", JSON.stringify(rest));
    if(err){
      logger.fatal('getRest: -->' + err);
      return next(err);
    }
    if(!rest) {
      return res.status(404).json({
        "message": "抱歉, 未找到相关餐厅，或未激活，请先激活。"
      });
    }
    return res.status(200).json(rest);
  });
};

exports.changeBlock = function (req, res, next) {

};

exports.updateRest = function (req, res, next) {

};

exports.deleteRest = function (req, res, next) {
  var user = req.session.user;
  let wh = {
    "id": req.params.id
  };
  Rest.deleteRest({status: user.id}, wh, function(err){
    if(err){
      logger.fatal('deleteRest: -->' + err);
      return next(err);
    }
    return res.status(200).json({
      "message": "删除成功！"
    });
  });
};
