"use strict";
var validator = require("validator");
var tools     = require("../common/tools");

function Form(){
  this.is_valid = true;
}

/**
 * 获取data中的值否则为空字符串''
 */
Form.prototype.getProp = function(data, key){
  var dt  = Object.hasOwnProperty.call(data, key) ?
    data[key]
    :  '';

    return dt;
};

Form.prototype.validateData = function(attr, data){
  for(var i=0; i< attr.length ; i++){
    var key = attr[i];
    var dt = this.getProp(data, key);
    this.formValidator(dt, key);
  }
};

Form.prototype.formValidator = function(data, data_name){
  //支持1-20个中文,下划线，横杠组成的字符
  var name_regx     = /^[a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,20}$/i;
  var isPhoneNumber = /^\d{11}$/;
  var pass_regx     = /^[a-zA-Z0-9@]{6,40}$/i;

  //支持邮箱和name登录
  if(data_name === 'account'){
    data_name = 'name';
    if(data.indexOf('@') > -1){
      data_name = "email";
    }
  }

  if(!data){
    data = '';
    this.error.message = '信息不完整';
  }
  switch(data_name){
    case "items_name":
    case "items_price":
      this.signError(
          !tools.sepWithSpace(data, data_name),
          "");
      break;
    case "id":
    case "item_id":
    case "user_id":
      this.signError(
          !validator.isNumeric(data),
          "id格式不正确",
          data_name, data);
      break;
    case "search_words":
      this.signError(
          !(data.length > 0 && data.length < 50),
          "请输入合适的关键词",
          data_name, data);
      break;
    case "keywords":
      this.signError(
          !tools.sepWithSpace(data),
          '关键词请以空格分割',
          data_name, data);
      break;
    case "description":
    case "content":
      this.signError(
          data.length < 1000 ? false: true,
          '文字过长',
          data_name, data);
      break;
    case "create_at":
      this.signError(
          !validator.isDate(data),
          '抱歉, 日期格式不正确',
          data_name, data);
      break;
    case "school":
      this.signError(
          !tools.isSchool(data),
          '请填写正确的学校信息',
          data_name, data);
      break;
    case "sex":
    case "gender":
      this.signError(
          data !== '男' && data !== '女',
          '请正确选择性别',
          data_name, data);
      break;
    case "price":
      this.signError(
          !tools.isAppropriatePrice(data),
          '抱歉,请输入合适的价格',
          data_name, data);
      break;
    case "url":
    case "picture_url":
      this.signError(
          !validator.isURL(data),
          '请输入正确链接',
          data_name, data);
      break;
    case "email":
      this.signError(
          !validator.isEmail(data),
          '请输入正确邮箱',
          data_name, data);
      break;
    case "mobile_phone":
    case "phone_number":
      this.signError(
          !isPhoneNumber.test(data),
          '请输入正确电话号码',
          data_name, data);
      break;
    case "name":
    case "real_name":
    case "login_name":
      this.signError(
          !name_regx.test(data),
          '请输入正确的名称',
          data_name, data);
      break;
    case "active_key":
      this.signError(
          typeof(data) !== "string",
          "active_key不正确",
          data_name, data);
      break;
    case "repass":
    case "new_pass":
    case "old_pass":
    case "password":
      this.signError(
          !pass_regx.test(data),
          '请输入合适的密码',
          data_name, data);
      break;
    default:
      this.error.message = '信息不完整';
  }

  if(this.error.message){
    this.is_valid  = false;
  }
};

Form.prototype.signError = function(condition, message, data_name, data){
  if(condition){
    this.error.message = message;
    this.error.key     = data_name;
  } else {
    this.cleaned_data[data_name] = String(data);
  }
};

module.exports = Form;
