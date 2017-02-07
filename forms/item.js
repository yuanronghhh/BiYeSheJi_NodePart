"use strict";
var Form      = require("./form");
var Item      = require('../proxys/item');

ItemForm.prototype = new Form();

function ItemForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

ItemForm.prototype.createItem = function(){
  var attr = [
    "name",
    "description",
    "keywords",
    "price",
  ];
  this.validateData(attr, this.data);
};

ItemForm.prototype.deleteItem = function(){
  var attr = [
    "id",
  ];
  this.validateData(attr, this.data);
};

ItemForm.prototype.getItem = function(){
  var attr = [
    "id"
  ];
  this.validateData(attr, this.data);
};

ItemForm.prototype.updateItem = function(){
  var attr = [
    "id"
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new ItemForm(data);
};
