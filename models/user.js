"use strict";
var Table      = require('./index');
var Connection = Table.Connection;

function UserModel(){
  this.tab_name    = 'user';
  this.schema = {
    "name"         : {"type": Connection.STRING},
    "picture_url"  : {"type": Connection.STRING},
    "email"        : {"type": Connection.STRING,
      "validate"   : {
        "isEmail": true,
      }
    },
    "gender"       : {"type": Connection.ENUM('男', '女')},
    "money"        : {"type": Connection.INTEGER, defaultValue: 0},
    "password"     : {"type": Connection.STRING},
    "status"       : {"type": Connection.INTEGER, defaultValue: 0},
    "phone_number" : {"type": Connection.STRING(11)},
    "create_at"    : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"    : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ['email'],
    "unique": true
  },{
    "fields": ['name'],
    "method": 'BTREE',
    "unique": true
  }];
  this.User = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.User.sync(Table.sync);
}

module.exports = new UserModel();
