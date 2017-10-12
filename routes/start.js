var express = require('express');
var router = express.Router();
var config = require('../config.json');

var service = require('../services/' + config.server.serviceManager);

/* POST start. */
router.post('/', function (req, res, next) {
  return service.serviceStart()
    .timeout(5000, 'Start timed out')
    .then(thenRespond)
    .catch(next);

  function thenRespond(result) {
    res.send(result);
  }
});

module.exports = router;
