var express = require('express');
var router = express.Router();
var config = require('../config.json');
var Q = require('q');
var assign = require('object-assign');

var service = require('../bin/' + config.serviceName);

/* GET status. */
router.get('/', function (req, res, next) {
  return service.serviceStatus()
    .timeout(5000, 'Status timed out')
    .then(respond)
    .catch(next);

  function respond(status) {
    return res.json(status);
  }
});

module.exports = router;
