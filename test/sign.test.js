var app     = require('../app');
var request = require('supertest');
var mm      = require('mm');
var tools   = require('../common/tools');
var support = require('./support');
var should  = require('should');
var 


describe('controllers/sign.js', function(){
  var wrong_data = {
    "name" : "djlasdj",
    "pass" : "djslajd",
    "email": "",
  };

  var right_data = {
    "name"        : "greyhound",
    "password"    : "121212",
    "email"       : "635044633@qq.com",
    "phone_number": "18120583139",
    "gender"      : "男",
  };

  afterEach(function(){
    mm.restore();
  });

  describe('signup', function(){

    it('should signup a user',function(done){
      done = pedding(done, 2);
      mm();

      request(app)
        .post('/signup')
        .send(right_data)
        .expect(200)
        .end(function(err, res){
          console.log(res.body);
          done(err);
        });
    });

    it('should get error when no data packed in', function(done){
      request(app)
        .post('/signup')
        .expect(403)
        .end(function(err, res){
          if(err){
            console.log(err);
          }
          console.log(res.body);
          done(err);
        });
    });

    it('should get error when post wrong data', function(done){
      request(app)
        .post('/signup')
        .send(wrong_data)
        .expect(403)
        .end(function(err, res){
          console.log(res.body);
          done(err);
        });
    });

  });

  describe('updatePass', function(){

  });

  describe('activeUser', function(){

  });


  describe('login', function(){
    var login_user = {
      "account": "635044633@qq.com",
      "password": "121212"
    };

    it('should get error without no data', function(done){

      request(app)
        .post('/login')
        .expect(403)
        .end(function(err, res){
          done(err);
          console.log(res.body);
          res.body.should.containEql('不完整');
        });
    });

    it('should login', function(done){

      request(app)
        .post('/login')
        .send(login_user)
        .expect(200)
        .end(function(err, res){
          done(err);
          console.log(res.body);
          res.body.should.containEql("成功");
        });
    });

  });

});


describe('resetPass', function(){
});

