var config      = require('../config/config');

exports.genCookie = function(user, res){
  var auth_token = user._id + '$$$';
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30, //30天
    signed: true,
    httpOnly: false
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); 
};

exports.userRequired = function(req,res,next){
  if(!req.session.user){
    return res.status(403).json({
      "message": "对不起请登录"
    });
  }

  if(req.session.user.is_admin){
    req.session.user.authened = true;
    req.session.user.blocked = false;
  }

  next();
};

exports.userAuthened = function(req, res, next){
  if(!req.session.user){
    return res.status(403).json({
      "message": "抱歉，请登录"
    });
  } else {
    if(!req.session.user.authened){
      return res.status(403).json({
        "message": "请认证后操作"
      });
    }
    next();
  }

};
