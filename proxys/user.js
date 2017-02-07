"use strict";
var UserModel = require('../models/user');
var User      = UserModel.User;
var _         = require('lodash');
var config    = require('../config/config');
var attrs     = [
  "id",
  "name",
  "email",
  "gender",
  "update_at"
];

exports.createUser = function(data, cb){
  User.create(data).then(function(){
    cb('');
  }).catch(cb);
};

exports.getUserByName = function(name, cb){
  let wh = {
    "name": name
  };
  getUser(wh, cb);
};

exports.getUserByEmail = function(email, cb){
  let wh = {
    "email": email
  };
  getUser(wh, cb);
};

/**
 * query.attrs 添加上面额外的属性
 * query.offset
 */
function getUsersByQuery(wh, cb, limits) {
  var add_attrs = [];
  if(Array.isArray(limits.attrs)) {
    add_attrs = limits.attrs;
  }
  let query = {
    "attributes": attrs.concat(add_attrs),
    "limit": config.limit,
    "offset": limits.offset || 0,
    "where": _.merge({status: config.status.activated}, wh)
  };
  User.findAll(query).then(function(user){
    cb('', user);
  }).catch(cb);
}
exports.getUsersByQuery = getUsersByQuery;

function getUsers(wh, cb, limits) {
  let query = {
    "limit": config.limit,
    "where": wh || {}
  };
  if(limits) {
    _.merge(query, limits);
  }
  User.findAll(query).then(function(user){
    cb('', user);
  }).catch(cb);
}
exports.getUsers = getUsers;

function getUser(wh, cb, limits){
  let query = {
    "where": wh
  };
  if(limits) {
    _.merge(query, limits);
  }
  User.findOne(query).then(function(user){
    cb('', user);
  }).catch(cb);
}
exports.getUser = getUser;

exports.getUserById = function(id, cb){
  let wh = {
    "id": Number(id)
  }
  getUser(wh, cb);
}

/**
 * 使用getUserByQuery会限制返回的user的属性
 */
function getUserByQuery(user, wh, cb){
  let query = {
    "attributes": attrs,
    "where": _.merge({"status": config.status.activated}, wh)
  }
  if(user.status === config.status.is_admin) {
    delete query.where;
    delete query.attributes;
  }
  User.findOne(query).then(function(user){
    cb('', user);
  }).catch(cb);
}
exports.getUserByQuery = getUserByQuery;

exports.activeUser = function(user, cb){
  user.status    = config.status.activated;
  user.update_at = Date(Date.now());
  user.save().catch(cb);
  return cb('');
};

exports.checkBlock = function(user){
  if(user.status === config.status.blocked){
    return true;
  }
  return false;
};

exports.changePassword = function(user, pass_hash, cb){
  var err = new Error("用户未激活");
  var is_admin = user.status !== config.status.is_admin ? true: false; // 如果是管理员,直接激活
  if(user.status === config.status.blocked && !is_admin){
    return cb(err);
  }

  user.update_at = Date(Date.now());
  user.password = pass_hash;
  user.save().catch(cb);
  return cb('');
};

exports.deleteUser = function(wh, cb) {
  let query = {
    "where": wh
  };
  User.destroy(query).then(function(user){
    cb('', user);
  }).catch(cb);
}
