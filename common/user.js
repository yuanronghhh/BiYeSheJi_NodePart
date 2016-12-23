var Form = require("./form");

function UserForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

UserForm.prototype = new Form();

UserForm.prototype.index = function (){
};

UserForm.prototype.index = function (){
};

UserForm.prototype.settings = function (){
};

module.exports = function(data){
  return new UserForm(data);
};
