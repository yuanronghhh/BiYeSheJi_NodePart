var config = require('../config/config');

exports.index = function(req, res){
  res.render("page/dist/index");
};

exports.config = function(req, res) {
  var name = req.query.name;
  var val  = req.query.val;
  config[name] = val;
  res.json(config);
};

exports.about = function(req, res) {

};
