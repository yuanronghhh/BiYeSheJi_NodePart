var Form      = require("./form");

SiteForm.prototype = new Form();

function SiteForm(data){
  this.data         = data;
  this.error        = {};
  this.cleaned_data = {};
}

SiteForm.prototype.search = function(){
  var attr = [
    'keywords'
  ];
  this.validateData(attr, this.data);
};

module.exports = function(data){
  return new SiteForm(data);
};
