var express = require('express');
var router = express.Router();
var config = require('../config.json');
var Q = require('q');
var assign = require('object-assign');

var svcName = 'svc' + config.svcName + 'js';
var service = require('../bin/' + svcName);

/* GET status. */
router.get('/', function (req, res, next) {
  var svc = service.serviceStatus();
  svc.then(function respond(status){
    return res.json(status);
  })
    .catch(next);
});

module.exports = router;
