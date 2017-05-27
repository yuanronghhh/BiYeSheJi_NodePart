"use strict";
var Table      = require('./index');
var Connection = Table.Connection;

function CommentModel(){
  this.tab_name    = 'comment';
  this.schema = {
    "content"     : {"type": Connection.TEXT},
    "item_id"     : {"type": Connection.INTEGER,
      "reference" :{
        "model": "item",
        "key": "id"
      },
      "onDelete": "cascade"
    },
    "user_id"     : {"type": Connection.INTEGER,
      "reference":{
        "model": "user",
        "key": 'id'
      },
      "onDelete": "cascade"
    },
    "user_name"   : {"type": Connection.STRING},
    "status"      : {"type": Connection.INTEGER, defaultValue: 0},
    "zan_count"   : {"type": Connection.INTEGER},
    "create_at"   : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"   : {"type": Connection.DATE, defaultValue: Connection.NOW}
  };
  this.indexes       = [{
    "fields": ['item_id']
  }, {
    "fields": ["user_id"]
  }, {
    "fields": ['create_at'],
    "order": "DESC"
  }];
  this.Comment = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Comment.sync(Table.sync);
}

module.exports = new CommentModel();
