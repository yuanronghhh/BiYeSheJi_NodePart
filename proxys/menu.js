var MenuModel = require('../models/menu');
var Menu      = MenuModel.Menu;
var attrs     = [
  'id',
  'name',
  'description',
  'price',
  'create_at',
  'update_at'
];

exports.createMenu = function(data, cb){
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
  if(user.status == 3){
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
