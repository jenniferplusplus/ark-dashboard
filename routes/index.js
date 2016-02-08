var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.title, basepath: config.basePath });
});

module.exports = router;
