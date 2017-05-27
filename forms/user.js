"use strict";
var Form = require("./form");

function UserForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

UserForm.prototype = new Form();

UserForm.prototype.create = function (){

};

UserForm.prototype.update = function (){
  var attr = [
    "name"
  ]
  if(this.data.picture_url){
    attr.push("picture_url");
  } else {
    this.cleaned_data.picture_url = "";
  }
  if(this.data.phone_number) {
    attr.push("phone_number");
  }
  this.validateData(attr, this.data);
};

UserForm.prototype.addUser = function() {
  var attr = [
    "phone_number",
    "password",
    "email",
    "gender",
    "name"
  ]
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new UserForm(data);
};
