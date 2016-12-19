var validator = require("validator");
var Tools     = require("./tools");

function Form(){
  this.is_valid = true;
}

Form.prototype.form_validator = function(data, data_type){
  //支持1-20个中文,下划线，横杠组成的字符
  var name_regx     =  /^[a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,20}$/i;
  var isPhoneNumber = /^\d{11}$/;
  var pass_regx     = /^[a-zA-Z0-9@]{6,40}$/i;
  var tools         = new Tools();
  var isSchool      = tools.isSchool(data);

  if(!data){
    data = '';
    this.error.message = '信息不完整';
  }
  switch(data_type){
    case "school":
      if(!isSchool){
        this.error.message = '抱歉,该不在服务范围';
      } else {
        this.cleaned_data[data_type] = data;
      }
      break;
    case "gender":
      if(data !== '男' || data !== '女'){
        this.error.message = '请选择正确性别';
      } else {
        this.cleaned_data[data_type] = data;
      }
      break;
    case "email":
      if(!validator.isEmail(data)){
        this.error.message = '请输入正确邮箱';
      } else {
        this.cleaned_data[data_type] = data;
      }
      break;
    case "phone_number":
      if(!isPhoneNumber.test(data)){
        this.error.message = '请输入正确电话号码';
      } else {
        this.cleaned_data[data_type] = data;
      }
      break;
    case "real_name":
    case "login_name":
      if(!name_regx.test(data)){
        this.error.message = '请输入正确的名称';
      } else {
        this.cleaned_data[data_type] = data;
      }
      break;
    case "pass":
      if(!pass_regx.test(data)){
        this.error.message = '请输入合适的密码';
      } else {
        this.cleaned_data[data_type] = data;
      } 
      break;
    default:
      this.error.message = '信息不完整';
  }

  if(this.error.message){
    this.is_valid = false;
  }

};

//注意, Form常驻内存问题
module.exports = Form;
