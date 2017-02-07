"use strict";
var app     = require('../../app');
var request = require('supertest');
var tools   = require('../../common/tools');
var support = require('../support');
var should  = require('should');

describe("controllers/site.js", function(){
  describe("search", function(){
    var search_words = {
      "search_words": "this"
    };

    it("should get error when keywords short", function(done) {
      request(app)
        .post("/search")
        .send({
          "search_words": "1"
        })
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should get result", function(done){
      request(app)
        .post("/search")
        .send(search_words)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });
  });

  describe("uploadPic", function(){
    it("should not upload before login");
    it("should upload a picture");
    it("should get upload picture");
    it("should get delete a upload picture");
  });

});
