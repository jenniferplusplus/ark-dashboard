'use strict';

var config = require('../config.json');
var timers = require('timers');
var service = require('../services/' + config.server.serviceManager);
var pendingStop = false;

module.exports = function stopOnEmpty() {
  if(pendingStop){
    return;
  }

  service.serviceStatus()
    .then(function parseStatus(status){
      if(status.status === 'running'){
        if((+status.numberOfPlayers) < 1){
          console.log('No players connected, shutdown scheduled');
          pendingStop = true;
          timers.setTimeout(stop, config.server.serviceEmptyTime * 1000)
        }
      }
    });

  function stop() {
    service.serviceStatus()
      .then(function stop(status){
        if((+status.numberOfPlayers) < 1){
          service.stop();
          console.log(status);
          console.log('No players connected, shutting down now');
        }
        else{
          console.log('Players connected, shutdown cancelled');
        }
        pendingStop = false;
      });
  }
};
