var app     = require('../app');
var request = require('supertest');
var tools   = require('../common/tools');
var should  = require('should');


describe('login', function(){
  var login_user = {
    "account": "635044633@qq.com",
    "password": "121212"
  };

  it('should get error without no data', function(done){
    request(app)
      .post('/login')
      .expect(403)
      .end(done);
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

describe('signup', function(){
  var wrong_data = {
    "name" : "djlasdj",
    "pass" : "djslajd",
    "email": "",
  };

  var right_data = {
    "name"        : "nice",
    "password"    : "121212",
    "email"       : "6350446@qq.com",
    "phone_number": "18120583139",
    "gender"      : "男",
  };

  it('should signup',function(done){
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

describe('resetPass', function(){
});

describe('activeUser', function(){
});
