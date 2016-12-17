var app     = require('../app');
var request = require('supertest');
var should  = require('should');


describe('login', function(){
  it('should get error without no data', function(done){
    request(app)
      .post('/login')
      .expect(403)
      .end(done);
  });

});

describe('signup', function(){
  it('should get error without no data', function(done){
    request(app)
      .post('/singup')
      .expect(403)
      .end(done);
  });

});

describe('updatePass', function(){

});

describe('user', function(){

});
