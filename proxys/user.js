"use strict";
var UserModel = require('../models/user');
var User      = UserModel.User;
var _         = require('lodash');
var config    = require('../config/config');
var attrs     = [
  "id",
  "name",
  "email",
  "picture_url",
  "status",
  "phone_number",
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
function getUsersByQuery(user, wh, opt, cb) {
  let query = {
    "attributes": attrs,
    "limit": config.limit,
    "offset": opt.offset || 0,
    "where": _.merge({status: config.status.activated}, wh)
  };

  query = _.defaults(opt, query);

  if(user.status === config.status.is_admin) {
    delete query.attributes;
  }

  User.findAll(query).then(function(users){
    cb('', users);
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
    delete query["attributes"];
    query.where = {"id": user.id};
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

exports.updateUser = function(user, data, cb) {
  _.merge(data, {update_at: Date(Date.now())});

  user.update(data).catch(cb);
  return cb('');
}

exports.checkDeActive = function(user) {
  if(user.status === config.status.deactivated) {
    return false;
  } 
  return true;
}

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

exports.getUserInfo = function (info, user) {
  let user_info = {};
  if (info.status === config.status.is_admin) {
    return user;
  }

  if (info.status === config.status.activated) {
    for(var attr of attrs) {
      user_info[attr] = user[attr];
    }

    if (info.status !== config.status.iswatcher) {
      user_info['money'] = user["money"];
    }
  }

  return user_info;
};

exports.deleteUser = function(user, wh, cb) {

  if(user.status === config.status.is_admin) {
    let query = {
      "where": wh
    };
    User.destroy(query).then(function(user){
      cb('', user);
    }).catch(cb);
  }
}
