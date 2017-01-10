var config        = require('../config/config');
var eventproxy    = require('eventproxy');
var Item          = require('../proxys/item');
var logger        = require('../common/logger');
var siteForm      = require('../forms/site');
var _             = require('lodash');
var multer        = require('multer');
var disk_storage  = require('../common/disk_storage');

exports.index = function(req, res){
  res.render("test");
};

exports.about = function(req, res) {

};

exports.search = function(req, res, next) {
  var form = siteForm(_.merge(req.query, req.body));
  form.search();
  if(!form.is_valid){
    return res.status(403).json(form.error);
  }

  Item.search(form.cleaned_data.keywords, function(err, items){
    if(err){
      logger.warn("search: " + err);
      return res.status(422).json({
        "message": "抱歉, 操作失败"
      });
    }
    return res.status(200).json(items);
  });
};

exports.config  = function(req, res, next) {
  var attr      = req.query.attr;
  var value     = req.query.value;
  var is_number = req.query.is_number;
  if(value){
    delete req.session.user[attr];
    if(value){
      if(is_number){
        req.session.user[attr] = Number(value);
      } else {
        req.session.user[attr] = value;
      }
    }
  }
  return res.json(req.session);
};

/**
 * 文件上传路径临时存放到req.session.user.images中,
 * 图片上传路径存放到user_name(随机值)文件夹存放。
 */
exports.uploadPic = function(req, res, next) {
  var images      = req.session.user.images;
  var upload_name = "upload";
  // 此处upload_path为相对config.upload_path的位置
  var storage = disk_storage({
    "destination": "",
    "upload_path": ""
  });

  var uploads = multer({
    "storage": storage,
    "limits": {
      "fileSize": 1024 * 1024 * 1
    }
  }).single(upload_name);

  uploads(req, res, function(err){
    if(err) {
      var message = "抱歉，上传失败。";
      images.pop();
      // 见multer/lib/make-error.js等其他限制
      if(err.code && err.code === "LIMIT_FILE_SIZE"){
        message = "抱歉, 文件过大。";
      }
      return res.status(422).json({
        "message": message
      });
    }
    res.status(200).json({
      "message": "上传成功"
    });
  });
};

exports.showPic = function(req, res, next) {
  var images = req.session.user.images;
  return res.status(200).json(images);
};

exports.deletePic = function(req, res, next) {
  var image_name = req.body.image_name;
  disk_storage({})._removeFile(req, image_name, function(err){
    if(err) {
      return next(err);
    }
    res.end();
  });
};
