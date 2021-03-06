"use strict";
var fs         = require('fs');
var path       = require('path');
var eventproxy = require('eventproxy');
var ejs        = require('ejs');
var config     = require('../config/config');
var tools      = require('../common/tools');

exports.preActive = function(form, next, cb){
  var email      = form.cleaned_data.email;
  var name       = form.cleaned_data.name;
  var is_man     = form.cleaned_data.gender === '男'?
    true
    : false;
  var time       = new Date();
  var create_at  = time.toLocaleString();
  var ep         = new eventproxy();

  ep.fail(next);

  //编译mail.html
  var mail_path    = path.join(__dirname, '../views/mail.html');
  fs.readFile(mail_path, ep.done(function(data){
    var html_content = ejs.compile(data.toString());
    ep.emit('get html', html_content);
  }));

  //使用email -> active_key
  tools.bhash(email, ep.done(function(hash){
    ep.emit('get active_key', hash);
  }));

  ep.all(['get active_key', 'get html'], function(active_key, html_content){
    var url = "/active_user/?active_key=" + active_key + "&"+
      "email=" + email + "&" +
      "create_at=" + create_at;
    var active_link = "http://" + config.domain + url;
      var info = {
      "link": {
        "domain": config.domain,
        "active_key": active_key,
        "create_at": create_at,
        "active": active_link,
        "url": url
      },
      "name": name,
      "signature": config.smtpConfig.auth.user,
      "gender": is_man,
      "email": email
    }
    var content = html_content(info);
    // just test
    fs.writeFile(path.join(__dirname, "../bin/gen_key.json"), JSON.stringify(info), function(err) {
      console.log("write gen_key err(for test only) --> ", err);
    });
    cb({
      email: email,
      content: content,
    });
  });
};

exports.preAdmin = function(form, next, cb){

};

exports.preResetPass = function(form, next, cb){
  var info =  {
    email: form.cleaned_data.email,
    content: "<div>重置的密码为: "+ form.cleaned_data.rs_pass +"请及时更改<div>"
  };
  fs.writeFile(path.join(__dirname, "../bin/gen_resetpass.json"), JSON.stringify(form.cleaned_data), function(err) {
    console.log("write gen_key err(for test only) --> ", err);
  });
  cb(info);
};
