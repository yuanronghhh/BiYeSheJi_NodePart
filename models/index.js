"use strict";
var config     = require('../config/config');
var Connection = require('sequelize');

var connection = new Connection(
    config.mysql.database,
    config.mysql.user, 
    config.mysql.password,
    {
      "host"   : config.mysql.host,
      "dialect": config.db,
      "logging": false,
      "define": {
        "charset": 'utf8',
        "dialectOptions": {
          "collate": 'utf8_general_ci',
        },
      },
      "pool"   : {
        "max" : 5,
        "min" : 0,
        "idle": 10000
      },
    });

function Table(){
  this.Connection = Connection;
  this.tab_config = {
    timestamps: false,
    createAt: false,
    updateAt: false,
  };
}

Table.prototype.createModel = function(tab_name, define, indexes){
  this.tab_config.indexes = indexes || [];
  return connection.define(tab_name, define, this.tab_config);
};

module.exports = new Table();
