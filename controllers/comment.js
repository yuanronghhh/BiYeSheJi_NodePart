"use strict";
var Comment       = require('../proxys/comment');
var logger        = require('../common/logger');
var commentForm   = require('../forms/comment');
var config        = require('../config/config');
var tools         = require('../common/tools');

var debug         = require('debug')("controllers/comment");

/**
 * 创建评论
 */
exports.createComment = function (req, res, next) {
  var session_user = req.session.user;
  var form = commentForm(req.body);

  form.createComment();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  form.cleaned_data.user_id = session_user.id;
  form.cleaned_data.user_name = session_user.name;
  Comment.createComment(form.cleaned_data, function(err, message){
    if(message) {
      logger.warn(message);
      return res.status(422).json({
        "message": message
      });
    }
    if(err){
      logger.fatal("createComment: create error --> " + err);
      return res.status(422).json({
        "message": "抱歉, 发布失败!"
      });
    }
    return res.status(200).json({
      "message": "发布成功"
    });
  });
};

/**
 * 根据菜品item_id 获取评论
 */
exports.getComments   = function(req, res, next) {
  var session_user    = req.session.user;
  var form            = commentForm(req.body);
  form.getComments();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  Comment.getCommentsByQuery(session_user, form.cleaned_data, 'create_at', {}, function(err, comments){
    debug("getComment: comments --> ", JSON.stringify(comments));
    if(err){
      logger.fatal('getComments: -->' + err);
      return next(err);
    }
    if(!comments) {
      return res.status(404).json({
        "message": "抱歉, 未找到相关评论。"
      });
    }
    return res.status(200).json({
      "message": "成功",
      "data": comments
    });
  });
};

exports.getUserComments = function(req, res, next) {
  var session_user      = req.session.user;
  var form              = commentForm(req.body);

  form.getUserComments();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  Comment.getCommentsByQuery(session_user, form.cleaned_data, 'create_at', {}, function(err, comments){
    debug("getComment: comments --> ", JSON.stringify(comments));
    if(err){
      logger.fatal('getComments: -->' + err);
      return next(err);
    }
    if(!comments) {
      return res.status(404).json({
        "message": "抱歉, 未找到相关评论。"
      });
    }
    return res.status(200).json({
      "message": "成功",
      "data": comments
    });
  });
};

exports.deleteComment = function (req, res, next) {
  var form = commentForm(req.params);
  form.deleteComment();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }
  var comment_id  = form.cleaned_data.id;

  Comment.getCommentById(comment_id, function(err, comment){
    if(err) {
      return next(err);
    }
    if(!comment) {
      return res.status(422).json({
        "message": "抱歉,未找到评论"
      });
    }
    Comment.deleteCommentById(comment_id, function(err){
      if(err) {
        logger.fatal("cannot delete comment");
        return next(err);
      }
      return res.status(200).json({
        "message": "恭喜,删除成功"
      });
    });
  });
};

exports.deleteComments = function (req, res, next) {

};

exports.updateComment = function (req, res, next) {
  var form = commentForm(req.params);
  form.updateComment();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  var comment_id  = form.cleaned_data.id;
  Comment.getCommentById(comment_id, function(err, comment){
    if(err) {
      logger.info("updateComment --> cannot getcomment");
      return next(err);
    }

    Comment.updateComment(form.cleaned_data, function(err) {
      if(err) {
        logger.fatal("updateComment: --> updateError");
        return next(err);
      }
      return res.status(200).json({
        "message": "更新成功"
      });
    });
  });
};

exports.changeBlock = function (req, res, next) {

};

exports.collect = function (req, res, next) {

};

exports.decollect = function (req, res, next) {

};

exports.hascollected = function (req, res, next) {

};
