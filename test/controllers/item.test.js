"use strict";
var app       = require('../../app');
var request   = require('supertest');
var tools     = require('../../common/tools');
var Item      = require('../../proxys/item');
var support   = require('../support');
var should    = require('should');

describe('controllers/item.js', function(){
  var ordinary_user = support.getUser()["ordinary_user"];
  var admin_user    = support.getUser()["admin_user"];
  var random_item   = support.getItem()["random_item"];
  var agent = request.agent(app);

  // before('init user', function(done){
  //   support.initUser(function(err){
  //     done(err);
  //   });
  // });

  // it("loign ordinary before get item", function(done){
  //   agent
  //     .post('/login')
  //     .send(ordinary_user)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  // it('should not create a item with ordinary_user', function(done) {
  //   agent
  //     .post("/item/create")
  //     .expect(403)
  //     .send(random_item)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  // it("loign admin before get item", function(done){
  //   agent
  //     .get('/signout')
  //     .end(function(err, res){
  //       console.log(JSON.stringify(res.body));
  //       agent
  //         .post('/login')
  //         .send(admin_user)
  //         .end(function(err, res){
  //           support.common(err, res, done);
  //         });
  //     });
  // });

  // it('should create a item with admin_user', function(done) {
  //   agent
  //     .post("/item/create")
  //     .expect(200)
  //     .send(random_item)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  // var item_id;
  // it("should get items", function(done) {
  //   agent
  //     .get("/item/getitems")
  //     .expect(200)
  //     .end(function(err, res) {
  //       console.log(JSON.stringify(res.body));

  //       item_id = res.body[0].id;
  //       agent
  //         .get("/item/" + item_id + "/detail")
  //         .expect(200)
  //         .end(function(err, res){
  //           console.log("--> get item detail <--");
  //           console.log(JSON.stringify(res.body));
  //           done(err);
  //         });
  //     });
  // });

  // it("should delete a item", function(done) {
  //   agent
  //     .post("/item/" + item_id + "/delete")
  //     .expect(200)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  // it("should not delete a item when not exists", function(done){
  //   agent
  //     .post("/item/" + item_id + "/delete")
  //     .expect(422)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  // it("should get 404 when item not exists", function(done){
  //   agent
  //     .get("/item/" + item_id + "/detail")
  //     .expect(404)
  //     .end(function(err, res){
  //       support.common(err, res, done);
  //     });
  // });

  describe("getGuessLike", function() {
    it("should get guess like items", function(done) {
      request(app)
        .get("/item/getguesslike")
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

  });

  describe("hotItems", function() {
    it("should get hot items");
  });

  describe("updateItem", function(){
    it("should update a item");
  });

  describe("changeBlock", function(){
    it("should block a item");
    it("should unblock a item");
  });

  describe("collect", function(){
    it("should collect a item");
    it("should decollect a item");
  });

  describe("collect", function(){
    it("should collect a item");
    it("should decollect a item");
  });

  describe("hascollected", function(){
    it("should hascollect a item");
  });
});
