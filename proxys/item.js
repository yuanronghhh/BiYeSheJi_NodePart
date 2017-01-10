var ItemModel  = require('../models/item');
var Item       = ItemModel.Item;
var config     = require('../config/config');
var _          = require('lodash');
var attrs      = [
  'id',
  'name',
  'description',
  'price',
  'create_at',
  'update_at',
  "zan",
  "collect_count"
];

exports.createItem = function(data, cb){
  Item.create(data).then(function(){
    cb('');
  }).catch(cb);
};

exports.getItemById = function(id, cb){
  var query = {
    "attributes": attrs,
    "where": _.merge({ status: config.status.activated }, {
      "id": id
    })
  };
  Item.findOne(query).then(function(item){
    cb('', item);
  }).catch(cb);
};

exports.getItemByName = function(name, cb){
  var query = {
    "attributes": attrs,
    "where": _.merge({ status: config.status.activated }, {
      "name": name
    })
  };
  Item.findOne(query).then(function(item){
    cb('', item);
  }).catch(cb);
};

exports.activeItem = function(item, cb){
  item.status    = config.status.activated;
  item.update_at = Date(Date.now());
  item.save().catch(cb);
  return cb('');
};

function getItems(user, wh, cb) {
  var query = {
    "limit": config.item_limit,
    "attributes": attrs,
    "where": _.merge({status: config.status.activated}, wh)
  };
  if(user.status === config.status.is_admin){
    delete query.attributes;
    delete query.where.status;
  }
  Item.findAll(query).then(function(items){
    cb('', items);
  }).catch(cb);
}
exports.getItems = getItems;

function deleteItems(user, wh, cb){
  Item.destroy({
    where: wh
  }).catch(cb);
}
exports.deleteItems = deleteItems;

exports.checkBlock = function(item){
  if(item.status === config.status.blocked){
    return true;
  }
  return false;
};

exports.changeBlock = function(item, cb) {
  if(item.status !== config.status.blocked) {
    item.status = config.status.blocked;
  } else {
    item.status = config.status.activated;
  }
  item.save().catch(cb);
  return cb('');
};

exports.search = function(key, cb) {
  var q = '%'+ key + '%';
  var wh = {
    $or: [
      {name:{$like: q}}, 
      {description:{$like: q}}
    ]
  };
  getItems({status:1}, wh, cb);
};
