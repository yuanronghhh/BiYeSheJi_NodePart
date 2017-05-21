"use strict";
var bcrypt     = require('bcryptjs');
var crypto     = require('crypto');
var validator  = require('validator');
var logger     = require('./logger');
var fs         = require('fs');
var path       = require('path');
var is         = require('is-type-of');

function Tools() {
}

/**
 * 根据权重出现true或者false
 * 权重越大, 越容易返回true
 * 默认0.5
 * weight 范围为[0, 1]
 */
Tools.prototype.randomTrue = function(weight) {
  weight = weight || 0.5;
  return weight > Math.random() ? true : false;
};

/**
 * 获取一定长度数字字符串。
 * 如果length不存在,则长度为0-20之间
 */
Tools.prototype.getRandomVcode = function(length){
  var Num = "";
  var len = length || Math.floor(Math.random()*20);
  for(var i = 0; i< len; i++){
    Num += Math.floor(Math.random()*10);
    Num = Num.toString();
  }
  return Num;
};

/**
 * 判断是否是数字
 * option排除加入的特殊字符, 每一个字符替换一次
 */
Tools.prototype.isdigit = function(st, option){
  var opt = option || "";
  var str;
  if(!st){
    return false;
  }
  str = st.toString();

  for (var i = 0; i < opt.length; i++) {
    str = str.replace(opt[i], "");
  }
  for(i = 0; i < str.length;i++){
    var tag = isNaN(str[i]);
    if(tag){
      return false;
    }
  }
  return true;
};

Tools.prototype.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);  //10为saltRounds，即随机数
};

Tools.prototype.bcompare = function (str, passhash, callback) {
  bcrypt.compare(str, passhash, callback);
};

/**
 * 根据str获取hash字符串, 如果str不存在则计算随机字符串后返回
 */
Tools.prototype.hashString = function(str){
  var st = str || Math.random().toString() + Date.now();
  return crypto.createHash("md5").update(st).digest('hex').substring(0,24);
};

Tools.prototype.getParentDir = function(pt) {
  var arr = pt.split(path.sep);
  return arr[arr.length - 1];
};

/**
 * 如果文件夹不存在则递归创建
 */
Tools.prototype.mkDir = function mkDir(dir_path, cb) {
  fs.exists(dir_path, function(bool){
    if(!bool) {
      var dir_name = path.dirname(dir_path);
      mkDir(dir_name, function(err){
        fs.mkdir(dir_path, cb);
      });
    } else {
      cb('');
    }
  });
};

/**
 * 判断是否是含有学字
 */
Tools.prototype.isSchool = function(school){
  var sh = school || '';
  var sh_regx = /.*学.*/;
  if(sh_regx.test(sh)){
    return true;
  }
  return false;
};

/**
 * 价格限定为[0, 999]
 */
Tools.prototype.isAppropriatePrice = function(price){
  var pc = price || '';
  return this.isdigit(pc, ".") && parseFloat(pc) < 1000 && pc.length > 0;
};

Tools.prototype.isOutOfDate = function(date, delta){
  var deadline = (new Date(Date.now() - delta)).toLocaleString();
  return validator.isAfter(deadline, date);
};

Tools.prototype.sepWithSpace = function(data) {
  data = data + ' ';
  var space_regx = /^([a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,30} )+$/;
  if(space_regx.test(data)){
    return true;
  } else {
    if(arguments.length === 2){
      logger.fatal('Tools.sepWithSpace: --> ' + data);
    }
    return false;
  }
};

/**
 * config为{}对象
 * 如果config中与extras中属性相同, 且后面的值为数组, 则拼接在后面
 * 其他属性则为替换config中原始值
 * 如果config中没有相应的属性,extras中的属性将添加进config
 * 返回 config
 */
Tools.prototype.appendConfig = function(config, extras){
  var keys = Object.keys(extras);
  for(let i = 0; i < keys.length; i++) {
    var attr = keys[i];
    var type_satisfy =  !typeof(config[attr])
      || this.getSameType(config[attr], extras[attr])
      ?  true: false;
    if(type_satisfy){
      if (type_satisfy && Array.isArray(config[attr])) {
        config[attr] = config[attr].concat(extras[attr]);
      } else {
        config[attr] = extras[attr];
      }
    }
  }
  return config;
}

/**
 * 判断ori和ext是否为同一数据类型
 */
Tools.prototype.getSameType = function(ori, ext) {
  var allow_type = [
    "number",
    "string",
    "array",
    "object"
  ];
  for(var i = 0; i < allow_type.length ;i++) {
    var key = allow_type[i];
    if(is[key](ori)&&is[key](ext)) {
      return true;
    }
  }
  return false;
}

module.exports = new Tools();
