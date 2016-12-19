var config = {
    "site_domain"                       : "www.ineeding.com",
    "port"                              : 3000,
    "site_logo"                         : "images/site_logo.png",
    "site_name"                         : "智能点餐系统",
    "description"                       : "a app for campus",
    "allow_sign_up"                     : true,
    "db"                                : "mongodb://127.0.0.1/testdb",
    "auth_cookie_name"                  : "INeeding",
    "session_secret"                    : "INeeding",
    "publish_valid_day"                 : 30 * 1000 * 60 * 60 * 24,        //发布有效时间30天
    "admins"                            : {
      "greyhound": true
    },
    "mailOptions"                       : {
      "from"     : "6344633@qq.com"     ,
      "subject"  : "认证信息提醒"       ,
    },
    "smtpConfig"                        : {
      "poll"     : true                 ,
      "host"     : "smtp.qq.com"        ,
      "port"     : 465                  ,
      "secure"   : true                 ,
      "auth": {
        "user"   : "635044633@@qq.com"  ,
        "pass"   : "hai@13144604356"
      }
    },
    "redis_host" : "127.0.0.1"          ,                                  //redis设置
    "redis_port" : 6379                 ,
    "redis_db  " : 0,
    "item_limit"     : 5,                                                  //物品或服务显示限制
    "msg_send_limit" : 3,                                                  //短信发送次数限制
    "login_err_times": 4,                                                  //登录错误次数限制
    "reply_interval" : 5 * 60 * 1000,                                      //5分钟之内不能回复两次
    "message_limit"  : 5,                                                  //系统消息显示限制
    "per_page"       : 10,                                                 //每页面显示数量
    "message_template": "",                                                //短信模板
};

module.exports = config;
