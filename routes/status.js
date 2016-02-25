var express = require('express');
var router = express.Router();
var config = require('../config.json');
var service = require('../bin/svcUpstart.js');
var steamSvc = require('../bin/steam.js');
var Q = require('q');
var assign = require('object-assign');

/* GET status. */
router.get('/', function (req, res, next) {
  var svc = service.serviceStatus();
  var steam = steamSvc.steamStatus();
  Q.allSettled([svc, steam])
    .spread(function cbStatus(svcSnap, steamSnap) {
      var svc = svcSnap.value || svcSnap.reason;
      var steam = steamSnap.value || steamSnap.reason;
      var resSvc = {};
      var status = svc.match(/ [\w\/]*/)[0];
      switch (status) {
        case 'stopped/waiting':
          resSvc.status = 'stopped';
          break;
        case 'start/running':
          resSvc.status = 'running';
          break;
        case 'start/pre-start':
          resSvc.status = 'starting';
          break;
        case 'pre-stop/stopping':
          resSvc.status = 'stopping';
          break;
        default:
          resSvc.error = svc;
          break;
      }

      var result = assign(resSvc, steam);
      res.send(result);
    })
    .catch(next);
});

module.exports = router;
