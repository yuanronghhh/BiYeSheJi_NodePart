var path   = require('path');
var config = {
  "domain"                            : "localhost:3000",
  "port"                              : 3000,
  "site_logo"                         : "images/site_logo.png",
  "site_name"                         : "智能点餐系统",
  "description"                       : "a app for campus",
  "allow_sign_up"                     : true,
  "auth_cookie_name"                  : "MindOrder",
  "session_secret"                    : "MindOrder",
  "active_out_delta"                  : 24 * 60 * 60 * 1000,             //注册码过期时间,24小时
  "status": {
    "deactivated": 0,
    "activated"  : 1,
    "is_admin"   : 2,
    "blocked"    : 3,
  },
  "admins"                            : {
    "greyhound"  : true
  },
  "mailOptions"                       : {
    "from"       : "635044633@qq.com" ,
    "subject"    : "[账号激活]"       ,
  },
  "smtpConfig"                        : {
    "poll"       : true               ,
    "host"       : "smtp.qq.com"      ,
    "port"       : 465                ,
    "secure"     : true               ,
    "auth": {
      "user"     : "635044633@qq.com",
      "pass"     : "yuanronghai@123"
    }
  },
  "db"           : "mysql"            ,
  "mysql"        : {
    "host"       : "127.0.0.1"        ,
    "user"       : "root"             ,
    "password"   : "root"             ,
    "database"   : "eat_test_db"      ,
    "charset"    : "utf8_general_ci"  ,
    "debug"      : true               ,
  },
  "debug"        : true               ,
  "redis"        : {
    "redis_host" : "127.0.0.1"        ,                                  //redis设置
    "redis_port" : 6379               ,
    "redis_db  " : 0,
  },
  "upload_path"     : path.resolve("uploads"),
  "limits"          : 5,                                                 //分页限制
  "msg_send_limit"  : 3,                                                 //短信发送次数限制
  "login_err_times" : 4,                                                 //登录错误次数限制
  "reply_interval"  : 5 * 60 * 1000,                                     //5分钟之内不能回复两次
  "message_limit"   : 5,                                                 //系统消息显示限制
  "per_page"        : 10,                                                //每页面显示数量
};

module.exports = config;
