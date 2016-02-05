var proc = require('child_process');
var config = require('../config.json');

module.exports = {
  serviceStatus: Q.promised(function () {
    return Q.nfcall(proc.exec, 'service ' + config.svcName + ' status');
  }),
  serviceStart: Q.promised(function () {
    return Q.nfcall(proc.exec, 'service ' + config.svcName + ' start');
  }),
  serviceStop: Q.promised(function () {
    return Q.nfcall(proc.exec, 'service ' + config.svcName + ' stop');
  })
};
