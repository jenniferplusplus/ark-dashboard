'use strict';

var config = require('../config.json');
var timers = require('timers');
var service = require('../services/' + config.server.serviceManager);

module.exports = function stopOnEmpty() {
  var pendingStop = false;

  if(pendingStop){
    return;
  }

  service.status()
    .then(function parseStatus(status){
      if(status.status === 'running'){
        if((+status.numberOfPlayers) < 1){
          console.log(new Date().toString(), 'No players connected, shutdown scheduled');
          pendingStop = true;
          timers.setTimeout(stop, config.server.serviceEmptyTime * 1000)
        }
      }
    });

  function stop() {
    service.status()
      .then(function stop(status){
        if((+status.numberOfPlayers) < 1){
          service.stop();
          console.log(new Date().toString(), 'No players connected, shutting down now');
        }
        else{
          console.log(new Date().toString(), 'Players connected, shutdown cancelled');
        }
        pendingStop = false;
      });
  }
};
