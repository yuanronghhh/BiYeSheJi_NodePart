"use strict";
var Table      = require('./index');
var Connection = Table.Connection;
var config     = require('../config/config');

function MenuModel(){
  this.tab_name    = 'menu';
  this.schema = {
    "total"            : {"type": Connection.FLOAT, defaultValue: 0},            //统计金额
    "status"           : {"type": Connection.INTEGER, defaultValue: config.status.deactivated},          //默认餐厅自动接单, 填为1
    "create_by"        : {"type": Connection.INTEGER,
      "reference": {
        "model": "user",
        "key": "id"
      },
      "onDelete": "cascade"
    },                                                                           // 下单用户
    "user_name"        : {"type": Connection.STRING},
    "remark"           : {"type": Connection.TEXT('tiny')},                      // 用户口味描述等要求
    "content"          : {"type": Connection.TEXT},                              // 订单数据
    "create_at"        : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"        : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ["create_by"],
    "unique": false
  }];
  this.Menu  = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Menu.sync(Table.sync);
}

module.exports = new MenuModel();
