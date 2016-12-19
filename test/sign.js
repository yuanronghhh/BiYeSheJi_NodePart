var app     = require('../app');
var request = require('supertest');
var should  = require('should');


describe('登录', function(){
  it('should get error without no data', function(done){
    request(app)
      .post('/login')
      .expect(403)
      .end(done);
  });

});

describe('注册', function(){
  var wrong_data = {
    "name" : "djlasdj",
    "pass" : "djslajd",
    "email": "",
  };
  var right_data = {
    "name"        : "dlkasjdlj",
    "pass"        : "djslajd",
    "email"       : "635044633@qq.com",
    "phone_number": "18120548752"
  };

  it('should signup',function(done){
    request(app)
      .post('/signup')
      .send(right_data)
      .expect(200)
      .end(function(err, res){
        if(err){
          return done(err);
        }
        var cookie = res.header['set-cookie'];

        request(app)
          .get('/signup')
          .set('Cookie', cookie)
          .end(function(err, res){
            if(err){
              return done(err);
            }
            res.body.should.containEql(ok);
          });
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
        done();
      });
  });

  it('should get error when post wrong data', function(done){
    request(app)
      .post('/signup')
      .send(wrong_data)
      .expect(403)
      .end(function(err, res){
        if(err){
          console.log(err);
        }
        console.log(res.body);
        done();
      });
  });

});

describe('updatePass', function(){
});

describe('user', function(){
});
