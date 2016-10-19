var config = require('../config.json');
var Q = require('q');
var exec = require('child-process-promise').exec;
var spawn = require('child-process-promise').spawn;
var strip = require('stripcolorcodes');

module.exports = {
  serviceStatus: Q.promised(execStatus),
  serviceStart: Q.promised(execStart),
  serviceStop: Q.promised(execStop),
  serviceRestart: Q.promised(execRestart)
};

var manager = config.server.serverManagerPath + 'arkmanager';
var instance = config.server.serviceName;

function execStatus() {
  return exec(manager + ' status ' + instance)
  // AST returns non-zero when a server is running
  // Sane programs interpret this as an error, but it's not
    .then(cbStatus, cbStatus);
}

function execStart() {
  return spawn(manager, ['start', instance]);
}

function execStop() {
  return spawn(manager, ['stop', instance]);
}

function execRestart() {
  return spawn(manager, ['restart', instance]);
}

function cbStatus(val) {
  var output = strip(val.stdout);
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
}
