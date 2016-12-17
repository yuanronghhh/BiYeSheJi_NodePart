
function form(){
}

exports.UserForm = function(req, res){
  var userKeys = [
    'name',
    'password'
  ];

  for(var i=0; i < userKeys.length; i++){
    key = userKeys[i];
    user[key] = req.body;
  }

};
