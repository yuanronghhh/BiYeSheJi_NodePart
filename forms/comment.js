"use strict";
var Form      = require("./form");
var Comment      = require('../proxys/Comment');

CommentForm.prototype = new Form();

function CommentForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

CommentForm.prototype.createComment = function(){
  var attr = [
    "content",
    "item_id"
  ];
  this.validateData(attr, this.data);
};

CommentForm.prototype.deleteComment = function(){
  var attr = [
    "id",
  ];
  this.validateData(attr, this.data);
};

CommentForm.prototype.getComments = function(){
  var attr = [
    "item_id"
  ];
  this.validateData(attr, this.data);
};

CommentForm.prototype.getUserComments = function(){
  var attr = [
    "user_id"
  ];
  this.validateData(attr, this.data);
};

CommentForm.prototype.updateComment = function(){
  var attr = [
    "id"
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new CommentForm(data);
};
