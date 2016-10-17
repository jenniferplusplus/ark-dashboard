var express = require('express');
var router = express.Router();
var config = require('../config.json');
var service = require('../bin/svcUpstart.js');
var steamSvc = require('../bin/steam.js');
var assign = require('object-assign');

var svcName = 'svc' + config.svcName + 'js';
var service = require('../bin/' + svcName);

/* POST status. */
router.post('/', function (req, res, next) {
  var svc = service.serviceStatus();
  svc.then(function cbRestart(result) {
    if (!result.error && (+result.numberOfPlayers) > 0) {
      res.set(400).send('The server cannot be restarted while there are players connected. If a restart is needed you should coordinate with the other players.');
    }
    else {
      service.serviceRestart()
        .timeout(5000, '')
        .then(function cbStart(result) {
          res.send(result);
        }, function ebStart(result) {
          if (result === '') {
            res.send();
          }
          else {
            next(result);
          }
        });
    }
  })
    .catch(next);
});

module.exports = router;
