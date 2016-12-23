var Table      = require('./index');
var Connection = Table.Connection;

function ItemModel(){
  this.tab_name    = 'Item';
  this.schema = {
    "title"       : {"type": Connection.STRING},
    "keywords"    : {"type": Connection.STRING},
    "price"       : {"type": Connection.FLOAT},
  };
  this.indexes       = [{
  }];
  this.Item = Table.createModel(this.tab_name, this.schema, this.indexes);
  this.Item.sync();
}

module.exports = new ItemModel();
