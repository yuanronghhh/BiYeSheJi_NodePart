"use strict";

var tools = require("./tools");
var rules = [{
  "message": "请注意荤素搭配哦",
  "weight": 0.8,
  "action": function(){}
}, {
  "message": "请少吃油炸",
  "weight": 0.8,
  "action": function(){
    for(var d of this.data) {
      if(d.keywords.indexOf("鸡") > -1) {
        return true;
      } else {
        return false;
      }
    }
  }
}, {
  "message": "您还可以添加一个主食",
  "weight": 0.4,
  "action": function(){}
}, {
  "message": "您可以尝尝的汤，也很美味哦",
  "weight": 0.4,
  "action": function(){}
}, {
  "message": "有啤酒才能尽兴",
  "weight": 0.5,
  "action": function(){}
}, {
  "message": "您不需要点一盘凉菜吗?",
  "weight": 0.2,
  "action": function(){
  }
}, {
  "message": "再点一盘花生吧",
  "weight": 0.4,
  "action": function(){
    for(var d of this.data) {
      if(d.keywords.indexOf("啤酒") > -1) {
        return true;
      } else {
        return false;
      }
    }
  }
}, {
  "message": "点一杯可乐吧",
  "weight": 0.2,
  "action": function(){}
}];

function Rule(data) {
  this.data = data;
  this.info = { "message": "" };
  this.rule_set = rules;
  this.checkRule();
}

Rule.prototype.checkRule = function(){
  for(var r of this.rule_set) {
    if(r.action.call(this, '')){
      this.signMessage(r.message, r.weight);
    }
  }

  if(tools.randomTrue(0.1)) {
    this.info.message = "";
  }
};

Rule.prototype.signMessage = function(message, weight) {
  if(tools.randomTrue(weight)) {
    this.info.message = message;
  }
};

module.exports = function(data) {
  return new Rule(data);
}
