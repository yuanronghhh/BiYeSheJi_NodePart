var config = require("../config/config");
var env = process.env.NODE_ENV || "dev";

var log4js = require("log4js");
var logger = log4js.getLogger("cheese");

log4js.configure({
  appenders: [{
    "type" : "console"
  },{
    "type": "file", 
    "filename": "docs/logs/cheese.log",
    "maxLogSize": 20480,
    "backups": 5,
    "category": "cheese"
  }]
});

logger.setLevel(config.debug !== "test" ? "DEBUG" : "ERROR");

module.exports = logger;
