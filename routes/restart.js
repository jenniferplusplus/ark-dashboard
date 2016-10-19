var express = require('express');
var router = express.Router();
var config = require('../config.json');
var assign = require('object-assign');

var service = require('../bin/' + config.serviceName);

/* POST status. */
router.post('/', function (req, res, next) {
  return service.serviceStatus()
    .then(thenRestart)
    .then(thenRespond)
    .catch(next);

  function thenRestart(status) {
    if ((+status.numberOfPlayers) > 0) {
      res.set(400);
      return 'The server cannot be restarted while there are players connected. If a restart is needed you should coordinate with the other players.';
    }
    else {
      return service.serviceRestart()
        .timeout(5000, 'Restart timed out');
    }
  }

  function thenRespond(result) {
    res.send(result);
  }

});

module.exports = router;
