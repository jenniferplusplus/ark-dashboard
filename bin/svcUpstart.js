var proc = require('child_process');
var config = require('../config.json');
var Q = require('q');
var exec = require('child-process-promise').exec;

module.exports = {
  serviceStatus: Q.promised(function () {
    return exec('service ' + config.svcName + ' status');
  }),
  serviceStart: Q.promised(function () {
    return exec('sudo service ' + config.svcName + ' start');
  }),
  serviceStop: Q.promised(function () {
    return exec('sudo service ' + config.svcName + ' stop');
  })
};
