"use strict";
var CommentModel  = require("../models/comment");
var Comment       = CommentModel.Comment;
var Item          = require("./item");
var config        = require("../config/config");
var logger        = require("../common/logger");
var _             = require("lodash");
var attrs         = [
  "id",
  "item_id",
  "user_id",
  "user_name",
  "content",
  "status",
  "create_at",
  "update_at"
];

exports.createComment = function(data, cb){
  Item.getItemById(data.item_id, function(err, item){
    if(err) {
      logger.fatal("err --> ", JSON.stringify(err));
      return cb(err);
    }
    if(!item){
      return cb("", "没有找到相关菜品");
    }

    data.status = config.status.activated;
    Comment.create(data).then(function(){
      item.comment_count += 1;
      try {
        item.save().catch(cb);
        cb("");
      } catch (e) {
        return cb(e);
      }
    }).catch(cb);
  });
};

function getCommentByQuery(user, wh, cb) {
  let query = {
    "attributes": attrs,
    "where": _.merge({ "status": config.status.activated }, wh)
  };
  if(user.status === config.status.is_admin){
    query.attributes = {};
  }
  Comment.findOne(query).then(function(comment){
    cb("", comment);
  }).catch(cb);
}
exports.getCommentByQuery = getCommentByQuery;

exports.getCommentById = function(id, cb){
  let wh = {
    "id": Number(id)
  }
  getComment(wh, cb);
}

function getComment(wh, cb){
  let query = {
    "where": wh
  };
  Comment.findOne(query).then(function(comment){
    cb("", comment);
  }).catch(cb);
}
exports.getComment = getComment;

exports.getCommentByName = function(name, cb){
  let wh = _.merge({ status: config.status.activated }, {
    "name": name
  })
  getComment(wh, cb);
};

exports.activeComment = function(comment, cb){
  comment.status    = config.status.activated;
  comment.update_at = Date(Date.now());
  comment.save().catch(cb);
  return cb("");
};

function getCommentsByQuery(user, wh, order, opt, cb) {
  if(attrs.indexOf(order.replace(" DESC", "")) === -1) {
    order = "";
  }
  let query = {
    "limit": config.limit,
    "attributes": attrs,
    "order": order,
    "where": _.merge({status: config.status.activated}, wh),
  };
  query = _.defaults(opt, query);
  if(user.status === config.status.is_admin){
    delete query.attributes;
    delete query.where.status;
  }
  Comment.findAll(query).then(function(comments){
    cb("", comments);
  }).catch(cb);
}
exports.getCommentsByQuery = getCommentsByQuery;

exports.deleteCommentsByIds = function(ids, cb){
  if(!Array.isArray(ids)){
    return cb(new Error("ids is not array"));
  }
  let wh = {
    "id":ids
  }
  deleteCommentsByQuery(wh, cb);
}

function deleteCommentsByQuery(wh, cb){
  Comment.destroy({
    "where": wh
  }).then(function(){
    cb("");
  }).catch(cb);
}
exports.deleteCommentsByQuery = deleteCommentsByQuery;

exports.deleteCommentById = function(id, cb) {
  let wh = {
    "id": Number(id)
  };
  deleteCommentsByQuery(wh, cb);
}

exports.checkBlock = function(comment){
  if(comment.status === config.status.blocked){
    return true;
  }
  return false;
};

exports.changeBlock = function(comment, cb) {
  if(comment.status !== config.status.blocked) {
    comment.status = config.status.blocked;
    comment.update_at = Date(Date.now());
  } else {
    comment.status = config.status.activated;
    comment.update_at = Date(Date.now());
  }
  comment.save().catch(cb);
  return cb("");
};

exports.search = function(key, cb) {
  let q = "%"+ key + "%";
  let wh = {
    $or: [
      {name:{$like: q}},
      {description:{$like: q}},
      {keywords: {$like: q}},
      {profile: {$like: q}}
    ]
  };
  getCommentsByQuery({status:1}, wh, "", {}, cb);
};

exports.updateComment = function(comment) {
}
