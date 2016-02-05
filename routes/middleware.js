var express = require('express');
var router = express.Router();
var session = require('express-session');
var config = require('../config.json');
var Q = require('q');
var crypto = require('crypto');

function sessionManager(req, res, next){
  if(req.session.authKey){
    return;
  }
  var hash = crypto.createHash(config.hashAlgorithm);
  hash.update(req.session.id + config.passphrase);
  req.session.authKey = hash.digest('hex');
  next();
}

function sessionAuth(req, res, next){
  var reqAuth = JSON.parse(req.body).authKey;
  if(reqAuth === req.session.authKey){
    next();
  }
  else{
    res.set(401).send('Your request could not be authorized. You may have used the wrong password, or your session may be expired.');
  }
}

router.use(session({
  secret: config.passkey,
  unset: 'destroy',
  cookie: {maxAge: 600 * 1000}
}));

router.any(/.*/, sessionManager);

router.post('/start', sessionAuth);
router.post('/restart', sessionAuth);


module.exports = router;
