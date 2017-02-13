var Form      = require("./form");
var User      = require('../proxys/user');

SignForm.prototype = new Form();

function SignForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

SignForm.prototype.signup = function(){
  var attr = [
    "email",
    "name",
    "phone_number",
    "password",
    "gender"
  ];
  this.validateData(attr, this.data);
};

SignForm.prototype.activeUser = function() {
  var attr = [
    'email',
    'active_key',
    'create_at'
  ];
  this.validateData(attr, this.data);
};

SignForm.prototype.login = function() {
  var attr = [
    "account",
    "password"
  ];
  this.validateData(attr, this.data);
};

SignForm.prototype.updatePass = function() {
  var attr = [
    "new_pass",
    "old_pass"
  ];
  this.validateData(attr, this.data);
};

SignForm.prototype.resetPass = function() {
  var attr = [
    "email",
  ];
  this.validateData(attr, this.data);
};

SignForm.prototype.reActive = function() {
  var attr = [
    "email",
    "name",
    "gender",
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new SignForm(data);
};
