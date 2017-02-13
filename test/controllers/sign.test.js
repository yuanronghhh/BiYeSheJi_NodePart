"use strict";
var app     = require('../../app');
var request = require('supertest');
var tools   = require('../../common/tools');
var support = require('../support');
var should  = require('should');

describe("controllers/sign.js", function(){
  var random_user = support.getUser()["random_user"];
  var admin_user  = support.getUser()["admin_user"];
  var ordinary_user = support.getUser()["ordinary_user"];
  var wrong_user  = support.getUser()["random_user"];
  if(wrong_user) {
    wrong_user.email = "12312323jl.com";
  }

  after(function(done){
    let wh = {
      "email": random_user.email
    };
    support.deleteUser(wh, function(err) {
      console.log("deleteUser err: --> ",err);
      done(err);
    });
  });

  describe("signup", function(){

    it("should signup a user",function(done){
      request(app)
        .post("/signup")
        .send(random_user)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should get error when no data packed in", function(done){
      request(app)
        .post("/signup")
        .expect(403)
        .end(function(err, res){
          if(err){
            console.log(err);
          }
          support.common(err, res, done);
        });
    });

    it("should get error when post wrong data", function(done){
      request(app)
        .post('/signup')
        .send(wrong_user)
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should not signup when email exists", function(done){
      request(app)
        .post("/signup")
        .send(random_user)
        .expect(422)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should not signup when name exists", function(done){
      done();
    });
  });

  describe('activeUser', function(){

    it("should not active when link out of date", function(done) {
      support.readTmpFile("gen_key.json", function(err, data) {
        if(err) {
          console.log(err);
          done(err);
        }
        data = JSON.parse(data);
        var delta = 1000 * 60 * 60 * 24 * 3;
        var tm = (new Date(Date.now() - delta)).toLocaleString();
        var link = "/active_user/?active_key=" + data.link.active_key +
          "&&email=" + data.email +
          "&&create_at=" + tm;
        request(app)
          .get(link)
          .expect(422)
          .end(function(err, res){
            support.common(err, res, done);
          });
      });
    });

    it("should active a user", function(done) {
      support.readTmpFile('gen_key.json', function(err, data) {
        if(err) {
          console.log(err);
          done(err);
        }
        data = JSON.parse(data);
        request(app)
          .get(data.link.url)
          .expect(200)
          .end(function(err, res) {
            support.common(err, res, done);
          });
      });
    });

    it("should not active when has actived", function(done) {

      support.readTmpFile('gen_key.json', function(err, data) {
        if(err) {
          console.log(err);
          done(err);
        }
        data = JSON.parse(data);
        request(app)
          .get(data.link.url)
          .expect(422)
          .end(function(err, res) {
            support.common(err, res, done);
          });
      });
    });
  });

  describe("reActive", function(){

    it("should not rective when email formate error", function(done){
      var active_email = "2123@3213";
      request(app)
        .post("/reactive")
        .send({
          "email": active_email,
          "gender": "男",
          "name": "greyhound"
        })
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        })
    });

    it("should not reActive when user not exists", function(done){
      var not_exist_email = "52134647@qq.com";
      request(app)
        .post("/reactive")
        .send({
          "email": not_exist_email,
          "gender": "男",
          "name": "greyhound"
        })
        .expect(422)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should not reActive when post too many times");
  });

  describe('login', function(){
    var agent = request.agent(app);

    it('should get error without no data', function(done){
      agent
        .post('/login')
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it('should login', function(done){
      agent
        .post("/login")
        .send(random_user)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });
  });

  describe('updatePass', function(){
    var update_pass_info = {
      "old_pass": 121212,
      "new_pass": 123123123
    };
    var agent;

    it("should not update pass before login", function(done){
      request(app)
        .post("/updatepass")
        .send(update_pass_info)
        .expect(403)
        .end(function(err, res) {
          support.common(err, res, done);
        });
    });

    it("login before update pass", function(done){
      agent = request.agent(app);
      agent
        .post("/login")
        .send(random_user)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        })
    });

    it("should not update pass when origin pass error", function(done) {
      agent
        .post("/updatepass")
        .send({
          "old_pass": "origin_pass_error",
          "new_pass": update_pass_info.new_pass
        })
        .expect(403)
        .end(function(err, res) {
          support.common(err, res, done);
        })
    });

    it("should not update pass when get pass empty", function(done) {
      agent
        .post("/updatepass")
        .send({
          "old_pass": update_pass_info.old_pass,
          "new_pass": ""
        })
        .expect(403)
        .end(function(err, res) {
          support.common(err, res, done);
        });
    });

    it("should update pass", function(done) {
      agent
        .post("/updatepass")
        .send(update_pass_info)
        .expect(200)
        .end(function(err, res) {
          support.common(err, res, done);
        });
    });

    it("should login after update pass", function(done) {
      agent
        .post("/login")
        .send({
          "account": random_user.account,
          "password": update_pass_info.new_pass
        })
        .expect(200)
        .end(function(err, res) {
          support.common(err, res, done);
        });
    });
  });

  describe('resetPass', function(){
    var agent       = request.agent(app);
    var reset_info = {
      email: random_user.email
    };

    it("should not reset before login", function(done) {
      agent
        .post("/resetpass")
        .send(reset_info)
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("admin login before reset pass", function(done){
      agent
        .post("/login")
        .send(admin_user)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should not reset pass when email error", function(done) {
      agent
        .post("/resetpass")
        .send({
          email: "213321not email"
        })
        .expect(403)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should reset pass", function(done){
      agent
        .post("/resetpass")
        .send(reset_info)
        .expect(200)
        .end(function(err, res){
          support.common(err, res, done);
        });
    });

    it("should login after rest pass", function(done){

      support.readTmpFile("gen_resetpass.json", function(err, data) {
        data = JSON.parse(data);
        agent
          .post("/login")
          .send({
            "account": data.email,
            "password": data.rs_pass
          })
          .expect(200)
          .end(function(err, res){
            support.common(err, res, done);
          });
      });
    });
  });
});
