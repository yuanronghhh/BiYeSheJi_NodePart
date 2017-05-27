"use strict";
var Table      = require("./index");
var Connection = Table.Connection;

function CollectionModel(){
  this.tab_name    = "collection";
  this.schema = {
    "create_by"      : {"type": Connection.INTEGER,
      "reference": {
        "model": "user",
        "key": "id"
      },
      "onDelete": "cascade"
    },
    "item_id"      : {"type": Connection.INTEGER,
      "reference": {
        "model": "item",
        "key": "id"
      }
    },
    "status"       : {"type": Connection.INTEGER, defaultValue: 0},
    "create_at"    : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"    : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ["email"],
    "unique": true
  },{
    "fields": ["name"],
    "method": "BTREE",
    "unique": true
  }];
  this.Collection = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Collection.sync(Table.sync);
}

module.exports = new CollectionModel();
