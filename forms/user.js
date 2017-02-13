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

};

module.exports = function(data){
  return new UserForm(data);
};
