var proc = require('child_process');
var config = require('../config.json');
var Q = require('q');

module.exports = {
  serviceStatus: Q.promised(function () {
    return Q.nfcall(proc.exec, 'service ' + config.svcName + ' status')
      .then(function (val) {
        return val[0];
        });
  }),
  serviceStart: Q.promised(function () {
    return Q.nfcall(proc.exec, 'sudo service ' + config.svcName + ' start')
      .then(function (val) {
        return val[0];
      });
  }),
  serviceStop: Q.promised(function () {
    return Q.nfcall(proc.exec, 'sudo service ' + config.svcName + ' stop')
      .then(function (val) {
        return val[0];
      });
  })
};
