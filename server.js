var express = require('express'),
    ua = require('express-useragent');

/** Return a function to create a express server */
module.exports = function () {
  var app = express();

    app.set('trust proxy', 'loopback, linklocal, uniquelocal');
    app.use(ua.express());

  /**
   * Read the request headers and return a JSON with some user info (IP,
   * language and Operative System)
   */
  var parseHeader = function (req, res) {
    var json = {};
    json.ipaddress = req.ip;
    json.language = req.acceptsLanguages()[0];
    json.software = req.useragent.os;
    res.json(json);
  }

  /** Serve static content in folder public/ */
  app.use(express.static('public'));
  app.get('/whoami', parseHeader);

  return app;
};
