var Menu       = require('../proxys/menu');
var logger     = require('../common/logger');
var menuForm   = require('../forms/menu');
var eventproxy = require('eventproxy');

exports.createMenu = function (req, res, next) {
  var form = menuForm(req.body || req.query);
  form.createMenu();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var ep   = new eventproxy();
  var name = form.cleaned_data.name;
  ep.fail(next);

  Menu.createMenu(form.cleaned_data, function(err){
    if(err){
      logger.fatal("createMenu: create error --> " + err);
      return res.status(422).json({
        "message": "创建失败!"
      });
    }
    return res.status(200).json({
      "message": "创建成功"
    });
  });
};

exports.getMenus = function(req, res, next) {
  var user = req.session.user;
  Menu.getMenus(user, '', function(err, items){
    if(err){
      logger.fatal('getMenus: -->' + err);
      return next(err);
    }
    return res.status(200).json(items);
  });
};

exports.getMenu = function(req, res, next) {
  var user = req.session.user;
  Menu.getMenuByName(name, function(err, menu){
    if(err){
      logger.fatal('getMenu: -->' + err);
      return next(err);
    }
    return res.status(200).json(menu);
  });
};

exports.changeBlock = function (req, res, next) {
  var form = menuForm(req.body || req.query);

};

exports.activeMenu = function (req, res, next) {

};

exports.hotMenus = function (req, res, next) {

};

exports.deleteMenu = function (req, res, next) {

};

exports.deleteMenus = function (req, res, next) {

};

exports.updateMenu = function (req, res, next) {

};

exports.updateMenu = function (req, res, next) {

};

exports.changeBlock = function (req, res, next) {

};
