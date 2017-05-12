"use strict";
var Form      = require("./form");
var Rest      = require('../proxys/rest');

RestForm.prototype = new Form();

function RestForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

RestForm.prototype.createRest = function(){
  var attr = [
    "name",
    "profile",
    "phone_number"
  ];
  this.validateData(attr, this.data);
};

RestForm.prototype.getRest = function(){
  var attr = [
    "id"
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new RestForm(data);
};
