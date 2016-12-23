var Table      = require('./index');
var Connection = Table.Connection;

function UserModel(){
  this.tab_name    = 'user';
  this.schema = {
    "name"         : {"type": Connection.STRING},
    "email"        : {"type": Connection.STRING,
      "primaryKey": true,
      "validate"  : {
        "isEmail": true,
      }
    },
    "password"     : {"type": Connection.STRING},
    "status"       : {"type": Connection.INTEGER, defaultValue: 0}, //0,未激活,1已经激活
    "phone_number" : {"type": Connection.STRING},
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
  this.User.sync();
}

module.exports = new UserModel();
