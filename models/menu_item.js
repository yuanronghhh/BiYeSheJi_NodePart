"use strict";
var Table      = require('./index');
var Connection = Table.Connection;

/**
 * 考虑到实际情况，用户每单的产品不会很多，因此不使用这个模型,如果使用反而加重搜索效率
 */
function MenuItemModel(){
  this.tab_name    = 'user';
  this.schema = {
    "item_id"      : {"type": Connection.INTEGER,
      "reference": {
        "model": "item",
        "key": "id"
      }
    },
    "menu_id"      : {"type": Connection.INTEGER,
      "reference": {
        "model": "menu",
        "key": "id"
      }
    },
    "create_at"    : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ['item_id'],
    "unique": true
  },{
    "fields": ['menu_id'],
    "method": 'BTREE',
    "unique": true
  }];
  this.MenuItem = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.MenuItem.sync(Table.sync);
}

module.exports = new MenuItemModel();
