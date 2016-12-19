var bcrypt = require('bcryptjs');
var crypto = require('crypto');

function Tools() {
}
/**
 * 获取一定长度数字字符串。
 */
Tools.prototype.getRandomVcode = function(length){
  var Num = "";
  for(var i=0; i< length; i++){
    Num += Math.floor(Math.random(Math.random())*10);
    Num = Num.toString();
  }
  return Num;
};

/**
 * 判断是否是数字
 * option排除加入的特殊字符
 */
Tools.prototype.isdigit = function(st, option){
  var opt = option || "";
  var str = st.toString();

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
 * 获取hash字符串
 */
Tools.prototype.hashString = function(){
  return crypto.createHash("md5").update(Math.random().toString()).digest('hex').substring(0,24);
};

Tools.prototype.isSchool = function(school){
  var sh = school || '';
  var sh_regx = /.*学.*/;
  if(sh_regx.test(sh)){
    return true;
  }
  return false;
};

module.exports = Tools;
