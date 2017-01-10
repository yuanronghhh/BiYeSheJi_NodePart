var UserModel = require('../models/user');
var User      = UserModel.User;
var config    = require('../config/config');

exports.createUser = function(data, cb){
  User.create(data).then(function(){
    cb('');
  }).catch(cb);
};

exports.getUserById = function(id, cb){
  User.findById(id).then(function(user){
    cb('', user);
  }).catch(cb);
};

exports.getUserByName = function(name, cb){
  var query = {
    "where": {"name": name}
  };
  User.findOne(query).then(function(user){
    cb('', user);
  }).catch(cb);
};

exports.getUserByEmail = function(email, cb){
  var query = {
    "where": {"email": email}
  };
  User.findOne(query).then(function(user){
    cb('', user);
  }).catch(cb);
};

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
