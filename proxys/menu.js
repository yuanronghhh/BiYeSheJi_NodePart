"use strict";
var MenuModel = require('../models/menu');
var Menu      = MenuModel.Menu;
var config    = require('../config/config');
var attrs     = [
  'id',
  'remark',
  'status',
  'total',
  'content',
  'create_at',
  'update_at'
];

exports.createMenu = function(user, menu, cb){
  var data = {
    "total": 0
  };

  for(var d of menu.content) {
    data["total"] += d.price;
  }

  if(user.money <= data["total"]) {
    return cb('', "您的余额不足以购买");
  }

  user.money -= data.total;

  user.save().then(function(){}).catch(cb);

  data["create_by"] = user.id;
  data["user_name"] = user.name;
  data["status"] = 0;
  data["content"] = JSON.stringify(menu.content);
  data["remark"] = menu.remark;

  Menu.create(data).then(function(){
    cb('');
  }).catch(cb);
};

exports.getMenuById = function(id, cb){
  Menu.findById(id).then(function(menu){
    cb('', menu);
  }).catch(cb);
};

exports.getMenuByName = function(name, cb){
  var query = {
    "where": {"name": name}
  };
  Menu.findOne(query).then(function(menu){
    cb('', menu);
  }).catch(cb);
};

exports.activeMenu = function(menu, cb){
  menu.status    = 1;
  menu.update_at = Date(Date.now());
  menu.save().catch(cb);
  return cb('');
};

exports.getMenus = function(user, wh, cb) {
  var query = {};
  query.attributes = attrs;

  if(user.status == config.status.is_admin){
    query.attributes = {};
  }

  if(wh){
    query.where = wh;
  }

  Menu.findAll(query).then(function(menus){
    cb('', menus);
  }).catch(cb);
};

function deleteMenus(user, wh, cb){
  Menu.destroy({
    where: wh
  }).then(function(user) {
    cb('');
  }).catch(cb);
}
exports.deleteMenus = deleteMenus;

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

exports.finishMenu = function(menu, cb){
  menu.status = 2;
  menu.save().catch(cb);
  return cb('');
};

exports.revertMenu = function(menu, cb){
  menu.status = 4;
  menu.save().catch(cb);
  return cb('');
};

exports.admitRevert = function(menu, cb){
  menu.status = 5;
  menu.save().catch(cb);
  return cb('');
};
