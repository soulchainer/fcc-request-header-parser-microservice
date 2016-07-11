var express = require('express');

/** Return a function to create a express server */
module.exports = function () {
  var app = express();

    app.set('trust proxy', 'loopback, linklocal, uniquelocal');

  /**
   * Read the request headers and return a JSON with some user info (IP,
   * language and User Agent)
   */
  var parseHeader = function (req, res) {
    var json = {};
    json.ipaddress = req.ip;
    json.language = req.acceptsLanguages()[0];
    json.software = req.get('User-Agent');
    res.json(json);
  }

  /** Serve static content in folder public/ */
  app.use(express.static('public'));
  app.get('/whoami', parseHeader);

  return app;
};
