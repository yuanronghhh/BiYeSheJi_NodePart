"use strict";
var Collection       = require('../proxys/collection');
var logger           = require('../common/logger');
var collectionForm   = require('../forms/collection');
var config           = require('../config/config');
var tools            = require('../common/tools');

var debug            = require('debug')("controllers/collection");

/**
 * 创建收藏
 */
exports.createCollection = function (req, res, next) {
  var session_user = req.session.user;
  var form = collectionForm(req.body);

  form.createCollection();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  form.cleaned_data.user_id = session_user.id;
  form.cleaned_data.user_name = session_user.name;
  Collection.createCollection(form.cleaned_data, function(err, message){
    if(message) {
      logger.warn(message);
      return res.status(422).json({
        "message": message
      });
    }
    if(err){
      logger.fatal("createCollection: create error --> " + err);
      return res.status(422).json({
        "message": "抱歉, 收藏失败!"
      });
    }
    return res.status(200).json({
      "message": "收藏成功"
    });
  });
};

exports.getUserCollections = function(req, res, next) {
  var session_user      = req.session.user;
  var form              = collectionForm(req.body);

  form.getUserCollections();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  Collection.getCollectionsByQuery(session_user, form.cleaned_data, 'create_at', {}, function(err, collections){
    debug("getCollection: collections --> ", JSON.stringify(collections));
    if(err){
      logger.fatal('getCollections: -->' + err);
      return next(err);
    }
    if(!collections) {
      return res.status(404).json({
        "message": "抱歉, 未找到相关收藏。"
      });
    }
    return res.status(200).json({
      "message": "成功",
      "data": collections
    });
  });
};

exports.deleteCollection = function (req, res, next) {
  var form = collectionForm(req.params);
  form.deleteCollection();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var collection_id  = form.cleaned_data.id;

  Collection.getCollectionById(collection_id, function(err, collection){
    if(err) {
      return next(err);
    }
    if(!collection) {
      return res.status(422).json({
        "message": "抱歉,未找到收藏"
      });
    }
    Collection.deleteCollectionById(collection_id, function(err){
      if(err) {
        logger.fatal("cannot delete collection");
        return next(err);
      }
      return res.status(200).json({
        "message": "恭喜,删除成功"
      });
    });
  });
};

exports.changeBlock = function (req, res, next) {

};

exports.collect = function (req, res, next) {

};

exports.decollect = function (req, res, next) {

};

exports.hascollected = function (req, res, next) {

};
