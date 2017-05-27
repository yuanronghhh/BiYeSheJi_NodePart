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
  if(!this.data.remark) {
    this.cleaned_data.remark = '';
  } else {
    this.cleaned_data.remark = this.data.remark;
  }

  var dt = JSON.parse(this.data.data);
  if(Array.isArray(dt)) {
    this.cleaned_data.content = dt;
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
