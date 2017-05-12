"use strict";
var Table      = require('./index');
var Connection = Table.Connection;
var UserModel  = require('./user');
var User       = UserModel.User;
var config     = require('../config/config');

function RestModel(){
  this.tab_name      = 'rest';
  this.schema = {
    "id"             : {"type": Connection.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    "name"           : {"type": Connection.STRING},
    "user_id"        : {"type": Connection.INTEGER, 
      "primaryKey"   : true,
      "reference":   {
        "model": "user",
        "key": 'id'
      }
    },
    "phone_number"   : {"type": Connection.STRING},
    "profile"        : {"type": Connection.TEXT},
    "picture_url"    : {"type": Connection.STRING},
    "status"         : {"type": Connection.INTEGER, defaultValue: config.status.blocked},
    "create_at"      : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"      : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ['name'],
    "unique": true
  }, {
    "fields": ['user_id'],
    "unique": true
  }];
  this.Rest  = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Rest.belongsTo(User, {foreignKey: 'user_id'})
  this.Rest.sync(Table.sync);
}

module.exports = new RestModel();
