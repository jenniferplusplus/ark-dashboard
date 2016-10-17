var config = require('../config.json');
var Q = require('q');
var exec = require('child-process-promise').exec;
var spawn = require('child-process-promise').spawn;

module.exports = {
  serviceStatus: Q.promised(execStatus),
  serviceStart: Q.promised(execStart),
  serviceStop: Q.promised(execStop),
  serviceRestart: Q.promised(execRestart)
};

function execStatus() {
  return exec('arkmanager ' + config.svcName + ' status @main')
    .then(function cbStatus(val) {
      var output = val.stdout;
      var status = {};

      var isRunning = /Server running:\s*(Yes|No)/gm.exec(output)[1] === 'Yes';
      var isListening = /Server listening:\s*(Yes|No)/gm.exec(output)[1] === 'Yes';

      if(isRunning && isListening){
        status.status = 'running';
      }
      else if(isRunning && !isListening){
        status.status = 'starting';
      }
      else{
        status.status = 'stopped';
      }

      if(/Server Name:/gm.test(output)){
        status.serverName = /Server Name:\s*(.*)/gm.exec(output)[1];
      }
      else{
        status.serverName = '';
      }


      if(/Active Players:\s*(.*)/gm.test(output)){
        status.numberOfPlayers = /Active Players:\s*(.*)/gm.exec(output)[1];
      }
      else{
        status.numberOfPlayers = '';
      }

      return status;
    });
}

function execStart() {
  return spawn('arkmanager', [config.svcName, 'start', '@main']);
}

function execStop() {
  return spawn('arkmanager', [config.svcName, 'stop', '@main']);
}

function execRestart() {
  return spawn('arkmanager', [config.svcName, 'restart', '@main']);
}
