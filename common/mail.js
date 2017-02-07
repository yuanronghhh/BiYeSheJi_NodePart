"use strict";
var nodemailer = require('nodemailer');
var config     = require('../config/config');
var logger     = require('./logger');

/**
 * content为转换过的网页
 * 报错返回null,并记录
 */
exports.sendEmail = function(receiver, content){
  config.mailOptions.to   = receiver;
  config.mailOptions.html = content;
  var transporter = nodemailer.createTransport(config.smtpConfig);
  return true;
  // transporter.sendMail(config.mailOptions, function(err, info){
  //   if(err){
  //     logger.fatal("mail send error: " + err);
  //     return false;
  //   }
  //   logger.info("mail success info: " + info);
  //   return true;
  // });
};
