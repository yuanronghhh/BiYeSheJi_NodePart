"use strict";
var User = require('../proxys/user');
var config = require('../config/config');

exports.changeBlock = function (req, res, next) {

};

exports.getDetail = function (req, res, next) {

};

exports.update = function (req, res, next) {

};

exports.getUser = function (req, res, next) {
  var user = req.session.user;
  var name = req.params.name || '';
  var privilige = { status: config.status.activated };

  if(name) {
    privilige = { status: config.status.iswatcher }
  }

  return res.status(200).json({
    "message": "成功",
    "user": User.getUserInfo(privilige, user)
  });
};

exports.getReplyHistory = function (req, res, next) {

};
