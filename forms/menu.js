"use strict";
var Form      = require("./form");
var Menu      = require('../proxys/menu');

MenuForm.prototype = new Form();

function MenuForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

MenuForm.prototype.createMenu = function(){
  var dt = JSON.parse(this.data);
  if(Array.isArray(dt)) {
    this.cleaned_data = dt;
  } else {
    this.error["message"] = "数据格式不正确";
    this.is_valid = false;
  }
};

MenuForm.prototype.showTip = function(){
  var dt = JSON.parse(this.data);
  if(Array.isArray(dt)) {
    this.cleaned_data = dt;
  } else {
    this.error["message"] = "数据格式不正确";
    this.is_valid = false;
  }
};

module.exports = function(data){
  return new MenuForm(data);
};
