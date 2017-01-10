var Form      = require("./form");
var Menu      = require('../proxys/menu');

MenuForm.prototype = new Form();

function MenuForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

MenuForm.prototype.createMenu = function(){
  var attr = [
    "description",
    "items_name",
    "items_price",
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new MenuForm(data);
};
