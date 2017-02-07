"use strict";
var ItemModel  = require('../models/item');
var Item       = ItemModel.Item;
var config     = require('../config/config');
var _          = require('lodash');
var attrs      = [
  'id',
  'name',
  'description',
  'price',
  'create_at',
  'update_at',
  "zan",
  "collect_count"
];

exports.createItem = function(data, cb){
  Item.create(data).then(function(){
    cb('');
  }).catch(cb);
};

function getItemByQuery(user, wh, cb) {
  let query = {
    "attributes": attrs,
    "where": _.merge({ "status": config.status.activated }, wh)
  };
  if(user.status === config.status.is_admin){
    delete query.attributes;
    delete query.where.status;
  }
  Item.findOne(query).then(function(item){
    cb('', item);
  }).catch(cb);
}
exports.getItemByQuery = getItemByQuery;

exports.getItemById = function(id, cb){
  let wh = {
    "id": Number(id)
  }
  getItem(wh, cb);
}

function getItem(wh, cb){
  let query = {
    "where": wh
  };
  Item.findOne(query).then(function(item){
    cb('', item);
  }).catch(cb);
}
exports.getItem = getItem;

exports.getItemByName = function(name, cb){
  let wh = _.merge({ status: config.status.activated }, {
    "name": name
  })
  getItem(wh, cb);
};

exports.activeItem = function(item, cb){
  item.status    = config.status.activated;
  item.update_at = Date(Date.now());
  item.save().catch(cb);
  return cb('');
};

function getItemsByQuery(user, wh, cb) {
  let query = {
    "limit": config.limit,
    "attributes": attrs,
    "where": _.merge({status: config.status.activated}, wh)
  };
  if(user.status === config.status.is_admin){
    delete query.attributes;
    delete query.where.status;
  }
  Item.findAll(query).then(function(items){
    cb('', items);
  }).catch(cb);
}
exports.getItemsByQuery = getItemsByQuery;

exports.deleteItemsByIds = function(ids, cb){
  if(!Array.isArray(ids)){
    return cb(new Error("ids is not array"));
  }
  let wh = {
    "id":ids
  }
  deleteItemsByQuery(wh, cb);
}

function deleteItemsByQuery(wh, cb){
  Item.destroy({
    "where": wh
  }).then(function(){
    cb("");
  }).catch(cb);
}
exports.deleteItemsByQuery = deleteItemsByQuery;

exports.deleteItemById = function(id, cb) {
  let wh = {
    "id": Number(id)
  };
  deleteItemsByQuery(wh, cb);
}

exports.checkBlock = function(item){
  if(item.status === config.status.blocked){
    return true;
  }
  return false;
};

exports.changeBlock = function(item, cb) {
  if(item.status !== config.status.blocked) {
    item.status = config.status.blocked;
  } else {
    item.status = config.status.activated;
  }
  item.save().catch(cb);
  return cb('');
};

exports.search = function(key, cb) {
  let q = '%'+ key + '%';
  let wh = {
    $or: [
      {name:{$like: q}}, 
      {description:{$like: q}}
    ]
  };
  getItemsByQuery({status:1}, wh, cb);
};

exports.updateItem = function(item) {
}
