var UserModel = require('../models/user');
var User      = UserModel.User;

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
  user.status    = 1;
  user.update_at = Date(Date.now());
  user.save().catch(cb);
  return cb('');
};

exports.checkBlock = function(user){
  if(user.status === 0){
    return true;
  }
  return false;
};

exports.changePassword = function(user, new_pass, cb){
  var err = new Error("用户未激活");
  var is_admin = user.is_admin;
  if(user.status === 0 && !is_admin){
    return cb(err);
  }

  user.password = new_pass;
  user.save().catch(cb);
  return cb('');
};
