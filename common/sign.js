var Form = require("./form");

SignForm.prototype = new Form();

function SignForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

SignForm.prototype.signup = function(){
  var email         = this.data.email;
  var name          = this.data.name;
  var pass          = this.data.pass;
  var phone_number  = this.data.phone_number;

  this.form_validator(phone_number, "phone_number");
  this.form_validator(name, "login_name");
  this.form_validator(email, "email");
  this.form_validator(pass, "pass");
};

SignForm.prototype.activeUser = function() {
};

SignForm.prototype.login = function() {
  var phone_number = this.data.phone_number;
  var pass         = this.data.pass;

  this.form_validator(phone_number, "phone_number");
  this.form_validator(pass, "pass");
};

SignForm.prototype.updatePass = function() {
  var old_pass = this.data.old_pass;
  var new_pass = this.data.new_pass;

  this.form_validator(old_pass, "old_pass");
  this.form_validator(new_pass, "new_pass");
};

SignForm.prototype.resetPass = function() {
  var email     = this.data.email;
  var reset_key = this.data.reset_key;

  this.form_validator(email, "email");
  this.form_validator(reset_key, "reset_key");
};

module.exports = function(data){
  return new SignForm(data);
};
