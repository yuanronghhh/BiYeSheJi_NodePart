var Table      = require('./index');
var Connection = Table.Connection;

function CommentModel(){
  this.tab_name    = 'comment';
  this.schema = {
    "title"       : {"type": Connection.STRING},
    "content"     : {"type": Connection.TEXT},
    "item_id"     : {"type": Connection.INTEGER,
      "reference" :{
        "model": item,
        "key": 'id'
      }
    },
    "user_id"     : {"type": Connection.INTEGER,
      "reference":{
        "model": user,
        "key": 'id'
      }
    },
    "deleted"     : {"type": Connection.BOOLEAN, defaultValue: false},
    "reported_bad": {"type": Connection.BOOLEAN, defaultValue: false},
    "zan_count"   : {"type": Connection.INTEGER},
    "create_at"   : {"type": Connection.DATE},
    "update_at"   : {"type": Connection.DATE}
  };
  this.indexes       = [{
  }];
  this.Comment = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Comment.sync();
}

module.exports = new CommentModel();
