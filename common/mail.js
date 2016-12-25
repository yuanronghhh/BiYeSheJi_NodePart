var nodemailer = require('nodemailer');
var config     = require('../config/config');

/**
 * content为转换过的网页
 * 报错返回null,并记录
 */
exports.sendEmail = function(receiver, content){
  config.mailOptions.to   = receiver;
  config.mailOptions.html = content;

  return true;
  //var transporter = nodemailer.createTransport(config.smtpConfig);
  //transporter.sendMail(config.mailOptions, function(err, info){
  //  if(err){
  //    console.log(err.response);
  //    return false;
  //  }
  //  console.log(info);
  //  return true;
  //});
};
