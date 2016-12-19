var Form = require("./form");

function UserForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

UserForm.prototype = new Form();

UserForm.prototype.index = function (){
  var name     = this.data.name;

  this.form_validator(name, "name");
};

UserForm.prototype.index = function (){
  var login_name     = this.data.login_name;

  this.form_validator(login_name, "login_name");
};

UserForm.prototype.settings = function (){
  var login_name       = this.data.login_name;
  var student_number   = this.data.student_number;
  var qq_number        = this.data.qq_number;
  var gender           = this.data.gender;
  var email            = this.data.email;
  var real_name        = this.data.real_name;
  var address          = this.data.address;
  var self_url         = this.data.self_url;

  this.form_validator(self_url, "self_url");
  this.form_validator(address, "address");
  this.form_validator(real_name, "real_name");
  this.form_validator(email, "email");
  this.form_validator(gender, "gender");
  this.form_validator(qq_number, "qq_number");
  this.form_validator(student_number, "student_number");
  this.form_validator(login_name, "login_name");
};

module.exports = function(data){
  return new UserForm(data);
};
