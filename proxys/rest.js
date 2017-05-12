"use strict";
var RestModel = require('../models/rest');
var Rest      = RestModel.Rest;
var _         = require('lodash');
var config    = require('../config/config');
var attrs     = [
  'id',
  'name',
  'profile',
  'phone_number',
  'create_at',
  'update_at'
];

exports.createRest = function(data, cb){
  Rest.create(data).then(function(){
    cb('');
  }).catch(cb);
};

function getRestByQuery(user, wh, cb) {
  let query = {
    "attributes": attrs,
    "where": _.merge({ "status": config.status.activated }, wh)
  };
  if(user.status === config.status.is_admin){
    delete query.attributes;
    delete query.where.status;
  }
  Rest.findOne(query).then(function(item){
    cb('', item);
  }).catch(cb);
}
exports.getRestByQuery = getRestByQuery;

exports.getRestById = function(id, cb){
  Rest.findById(id).then(function(menu){
    cb('', menu);
  }).catch(cb);
};

exports.getRestByName = function(name, cb){
  var query = {
    "where": {"name": name}
  };
  Rest.findOne(query).then(function(menu){
    cb('', menu);
  }).catch(cb);
};

exports.activeRest = function(menu, cb){
  menu.status    = 1;
  menu.update_at = Date(Date.now());
  menu.save().catch(cb);
  return cb('');
};

exports.getRests = function(user, wh, cb) {
  var query = {};
  query.attributes = attrs;
  if(user.status == 3){
    query.attributes = {};
  }
  if(wh){
    query.where = wh;
  }
  Rest.findAll(query).then(function(menus){
    cb('', menus);
  }).catch(cb);
};

function deleteRests(user, wh, cb){
  Rest.destroy({
    where: wh
  }).catch(cb);
}
exports.deleteRests = deleteRests;

exports.checkBlock = function(menu){
  if(menu.status === 0){
    return true;
  }
  return false;
};

exports.changeBlock = function(menu, cb) {
  if(menu.status !== 0) {
    menu.status = 0;
  } else {
    menu.status = 1;
  }
  menu.save().catch(cb);
  return cb('');
};
