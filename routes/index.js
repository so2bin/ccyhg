var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CC优惠购' , items: [1,2,3,4,5,6,7,8,9]});
  //next();
});

module.exports = router;
