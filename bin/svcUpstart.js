var proc = require('child_process');
var config = require('../config.json');
var Q = require('q');
var exec = require('child-process-promise').exec;
var spawn = require('child-process-promise').spawn;

module.exports = {
  serviceStatus: Q.promised(function () {
    return exec('service ' + config.svcName + ' status')
      .then(function cbStatus(val) {
          return val.stdout + val.stderr;
        });
  }),
  serviceStart: Q.promised(function () {
    return spawn('service', [config.svcName, 'start']);
  }),
  serviceStop: Q.promised(function () {
    return spawn('service', [config.svcName, 'stop']);
  }),
  serviceRestart: Q.promised(function () {
    return spawn('service', [config.svcName, 'restart']);
  })
};
