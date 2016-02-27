var express = require('express');
var router = express.Router();
var config = require('../config.json');
var service = require('../bin/svcUpstart.js');
var assign = require('object-assign');

/* POST status. */
router.post('/', function (req, res, next) {
  var svc = service.serviceStart();
  svc.timeout(5000, '')
    .then(function cbStart(result){
      res.send(result);
    }, function ebStart(result){
      if(result === ''){
        res.send();
      }
      else{
        next(result);
      }
    }).catch(next);
});

module.exports = router;
