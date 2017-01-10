var app     = require('../app');
var request = require('supertest');
var should  = require('should');


describe('home', function(){

  it('should get html page', function(done){
    request(app)
      .get('/')
      .expect('content-type', /html/)
      .expect(200)
      .end(done);
  });

  it('should get 404 when not define the url', function(done){
    request(app)
      .get('/other')
      .expect(404)
      .end(done);
  });

});

describe('about', function(){
  it('should get about page');
});

describe('search', function(){
  it('should get search result');
});
