"use strict";
var User    = require('../proxys/user');
var tools   = require('../common/tools');
var request = require('supertest');
var app     = require('../app');
var fs      = require('fs');
var path    = require('path');
var config  = require('../config/config.js');
var auth    = require('../middlewares/auth');

exports.deleteUser = function(wh, cb) {
  User.deleteUser(wh, cb);
}

function saveUser(data, cb){
  var agent = request.agent(app);

  agent
    .post("/signup")
    .send(data)
    .expect(200)
    .end(function(err, res){
      if(err){
        return cb(err);
      }

      User.getUserByEmail(data["email"], function(err, user){
        user.status = data.status;
        user.save(function(err){
          cb(err);
        });
      });
    });
}

exports.initUser = function(cb) {
  var admin_user = getUser()['admin_user'];
  var ordinary_user = getUser()['ordinary_user'];
  saveUser(ordinary_user, function(err){
  });
  saveUser(admin_user, function(err){
  });
  cb();
}

exports.common = function(err, res, done) {
  console.log(JSON.stringify(res.body));
  done(err);
}

function getUser() {
  var account = tools.getRandomVcode(8);
  return {
    "admin_user": {
      "name": "admin",
      "email": "635044633@qq.com",
      "password": 121212,
      "account": "635044633@qq.com",
      "status": config.status.is_admin,
      "gender": "男",
      "phone_number": "18120583139"
    },
    "ordinary_user": {
      "email": "18120583139@qq.com",
      "password": 121212,
      "account": "18120583139@qq.com",
      "status": config.status.activated,
      "gender": "女",
      "phone_number": "18120583139",
      "name": "normal_user"
    },
    "random_user": {
      "account"     : account,
      "name"        : account,
      "password"    : 121212,
      "email"       : tools.getRandomVcode(8) + "@qq.com",
      "phone_number": tools.getRandomVcode(11),
      "gender"      : "男"
    }
  };
}
exports.getUser = getUser;

exports.getItem = function(cb){
  return {
    "random_item": {
      "name": tools.getRandomVcode(),
      "description": "random description is:" + tools.hashString(),
      "keywords": "random keywords" + tools.getRandomVcode(),
      "price": tools.getRandomVcode(3) + "." + tools.getRandomVcode(2),
    }
  };
}

exports.readTmpFile = function(name, cb) {
  name = path.join(__dirname, "../bin/" + name);
  fs.readFile(name, "utf-8",cb);
}
