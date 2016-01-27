var express = require('express');
var router = express.Router();
var config = require('../config.json');
var proc = require('child_process');
var s3 = require('steam-server-status');
var Q = require('q');
var assign = require('object-assign');

/* GET status. */
router.get('/', function (req, res, next) {
  var svc = serviceStatus();
  var steam = steamStatus();
  Q.all([svc, steam])
    .spread(function cbStatus(svc, steam) {
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

var serviceStatus = Q.promised(function () {
  return Q.nfcall(proc.exec, 'service ' + config.svcName + ' status');
  //proc.exec('service ' + config.svcName + ' status', callback);
});

var steamStatus = Q.promised(function () {
  return Q.nfcall(s3.getServerStatus, config.address, 27015);
});

module.exports = router;
