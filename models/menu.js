"use strict";
var Table      = require('./index');
var Connection = Table.Connection;

function MenuModel(){
  this.tab_name    = 'menu';
  this.schema = {
    "description" : {"type": Connection.TEXT},                              //用户口味描述等要求
    "items_name"  : {"type": Connection.STRING},                            //已经添加的菜品,逗号隔开
    "items_prices": {"type": Connection.STRING},                            //对应菜品价格
    "total"       : {"type": Connection.FLOAT, defaultValue: 0},            //统计金额
    "status"      : {"type": Connection.INTEGER, defaultValue: 0},          //店家接单以后才激活
    "create_at"   : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"   : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [];
  this.Menu  = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Menu.sync(Table.sync);
}

module.exports = new MenuModel();
