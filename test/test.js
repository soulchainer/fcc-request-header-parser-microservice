var app = require('../server');
var chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect;

chai.use(chaiHttp);

describe('server', function() {
  var server;

  /** Before the test, create a server using server.js */
  beforeEach(function() {
    server = app().listen(8081);
  });

  afterEach(function() {
    server.close();
  });

  var baseURL = 'http://localhost:8081';

  it('prints out the index.html page when user goes to /', function(done) {
    chai.request(baseURL)
    .get('/')
    .end(function(error, res) {
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      done();
    });
  });

  it('prints out something like {"ipaddress":"188.77.42.118","language":"en-US","software":"X11; Linux x86_64; rv:49.0"} when user goes to /whoami', function(done) {
    chai.request(baseURL)
    .get('/whoami')
    // Set example headers
    .set('Accept-Language', ['en-US', 'en', 'es'])
    .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0')
    .end(function(error, res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      var ip = res.body.ipaddress,
          lang = res.body.language,
          soft = res.body.software;
      expect(ip).to.be.an.ip;
      expect(lang).to.be.not.empty;
      expect(lang).to.equal('en-US');
      expect(soft).to.be.equal('Linux 64');
      done();
    });
  });

  it('shows the standard error page when user tries to access a non legal route', function(done) {
    chai.request(baseURL)
    .get('/ilegalroute')
    .end(function(error, res) {
      expect(res).to.have.status(404);
      done();
    });
  });
});
