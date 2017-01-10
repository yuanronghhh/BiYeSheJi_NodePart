var nodemailer = require('nodemailer');
var config     = require('../config/config');
var logger     = require('log4js');

/**
 * content为转换过的网页
 * 报错返回null,并记录
 */
exports.sendEmail = function(receiver, content){
  config.mailOptions.to   = receiver;
  config.mailOptions.html = content;
  console.log(config.mailOptions.html);
  return true;
  // var transporter = nodemailer.createTransport(config.smtpConfig);
  // transporter.sendMail(config.mailOptions, function(err, info){
  //   if(err){
  //     logger.fatal("mail send error: " + err.response);
  //     return false;
  //   }
  //   logger.info("mail success info: " + info);
  //   return true;
  // });
};
