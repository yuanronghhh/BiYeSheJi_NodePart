"use strict";
var fs         = require('fs');
var eventproxy = require('eventproxy');
var tools      = require('../common/tools');
var path       = require('path');
var config     = require('../config/config');
var debug      = require('debug')("common/disk_storage");

/**
 * 此处主要使用本地存储,若要使用云存储
 * 可以直接在外部定义destination中定义。
 */
DiskStorage.prototype.getDestination = function(req, file, cb) {
  var user        = req.session.user;
  var user_name   = user.name;
  var upload_path = path.join(this.upload_path, user_name);
  var name = this.getFilename('.jpg');
  tools.mkDir(upload_path, function(err) {
    if(err) {
      return cb(err);
    }
    user.images.push(name);
    cb(null, path.join(upload_path, name));
  });
}

function DiskStorage(opts){
  this.upload_path    =  path.join(config.upload_path, (opts.upload_path || ''));
  this.destination    = opts.destination || this.getDestination;
}

DiskStorage.prototype.getFilename = function(ext){
  if(ext.indexOf('.') > -1){
    return tools.hashString() + ext;
  } else {
    return tools.hashString() + '.' + ext;
  }
};

DiskStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.destination(req, file, function(err, path) {
    if (err) {
      return cb(err);
    }
    var outStream = fs.createWriteStream(path);
    file.stream.pipe(outStream);
    outStream.on("error", cb);
    outStream.on("finish", function () {
      cb(null, {
        path: path,
        size: outStream.bytesWritten
      });
    });
  });
};

DiskStorage.prototype._removeFile = function (req, image_name, cb) {
  var user      = req.session.user;
  var images    = user.images;
  var user_path = path.join(this.upload_path, user.name);
  var pt = path.join(user_path, image_name);
  images = images.filter(function(value) {
    if(value === image_name){
      return;
    }
    return value;
  });
  debug("DiskStorage: pt --> ", pt);
  fs.unlink(pt, cb);
};

module.exports = function (opts) {
  return new DiskStorage(opts);
};
