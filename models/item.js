var Table      = require('./index');
var Connection = Table.Connection;

function ItemModel(){
  this.tab_name    = 'item';
  this.schema = {
    "name"           : {"type": Connection.STRING},
    "description"    : {"type": Connection.TEXT},
    "keywords"       : {"type": Connection.STRING},
    "price"          : {"type": Connection.FLOAT},
    "status"         : {"type": Connection.INTEGER, defaultValue: 0}, //0,未激活,1已经激活
    "collect_count"  : {"type": Connection.INTEGER, defaultValue: 0},
    "zan"            : {"type": Connection.INTEGER, defaultValue: 0}, // 点赞次数
    "create_at"      : {"type": Connection.DATE, defaultValue: Connection.NOW},
    "update_at"      : {"type": Connection.DATE, defaultValue: Connection.NOW},
  };
  this.indexes       = [{
    "fields": ['name'],
    "unique": true
  }, {
    "fields": ["price"],
    "order": "DESC"
  }];
  this.Item  = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Item.sync();
}

module.exports = new ItemModel();
