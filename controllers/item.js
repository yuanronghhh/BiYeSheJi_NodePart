"use strict";
var Item       = require('../proxys/item');
var logger     = require('../common/logger');
var itemForm   = require('../forms/item');
var eventproxy = require('eventproxy');
var debug      = require('debug')("controllers/item");

/**
 * 创建菜品
 */
exports.createItem = function (req, res, next) {
  var user = req.session.user;
  var form = itemForm(req.body || req.query);
  var ep   = new eventproxy();
  form.createItem();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  ep.fail(next);

  var name = form.cleaned_data.name;
  Item.getItemByName(name, function(err, item){
    if(err){
      return res.status(406).json({
        "message": "操作失败"
      });
    }
    if(!item){
      return ep.emit('create item');
    }
    return res.status(422).json({
      "message": "抱歉, 您已经创建过该菜品, 不能重复创建"
    });
  });
  ep.on('create item', function(){

    Item.createItem(form.cleaned_data, function(err){
      if(err){
        logger.fatal("createItem: create error --> " + err);
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
 * 获取已经创建成功的菜品
 */
exports.getItems = function(req, res, next) {
  var user = req.session.user;
  Item.getItemsByQuery(user, {}, function(err, items){
    debug("getItemsByQuery: items --> ", JSON.stringify(items));
    if(err){
      logger.fatal('getItemsByQuery: --> ' + err);
      return next(err);
    }
    return res.status(200).json(items);
  });
};

/**
 * 查看菜品详细情况
 */
exports.getItem = function(req, res, next) {
  var user    = req.session.user;
  var form    = itemForm(req.params);
  form.getItem();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var item_id = form.cleaned_data.id;
  Item.getItemByQuery(user, {id: item_id}, function(err, item){
    debug("getItem: item --> ", JSON.stringify(item));
    if(err){
      logger.fatal('getItem: -->' + err);
      return next(err);
    }
    if(!item) {
      return res.status(404).json({
        "message": "抱歉, 未找到相关菜品。"
      });
    }
    return res.status(200).json(item);
  });
};

exports.changeBlock = function (req, res, next) {
  var user = req.session.user;
  var form = itemForm(req.body);


};

/**
 * 使菜品上架
 */
exports.activeItem = function (req, res, next) {
};

exports.hotItems = function (req, res, next) {
  var user = req.session.user;
  var wh = {
    "$or": [
      {"collect_count": { "$gte": 3 }},
      {"zan": { "$gte": 3 }}
    ]
  };
  Item.getItemsByQuery(user, wh, function(err, items){
    if(err) {
      return next(err);
    }
    return res.status(200).json(items);
  });
};

exports.deleteItem = function (req, res, next) {
  var form = itemForm(req.params);
  form.deleteItem();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var item_id  = form.cleaned_data.id;

  Item.getItemById(item_id, function(err, item){
    if(err) {
      return next(err);
    }
    if(!item) {
      return res.status(422).json({
        "message": "抱歉,未找到菜品"
      });
    }
    Item.deleteItemById(item_id, function(err){
      if(err) {
        logger.fatal("cannot delete item");
        return next(err);
      }
      return res.status(200).json({
        "message": "恭喜,删除成功"
      });
    });
  });
};

exports.deleteItems = function (req, res, next) {

};

exports.updateItem = function (req, res, next) {
  var form = itemForm(req.params);
  form.updateItem();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  var item_id  = form.cleaned_data.id;
  Item.getItemById(item_id, function(err, item){
    if(err) {
      logger.info("updateItem --> cannot getitem");
      return next(err);
    }

    Item.updateItem(form.cleaned_data, function(err) {
      if(err) {
        logger.fatal("updateItem: --> updateError");
        return next(err);
      }
      return res.status(200).json({
        "message": "更新成功"
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
