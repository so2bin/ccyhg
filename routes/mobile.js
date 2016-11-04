/**
 * Created by duoyi on 16-8-23.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'../public/html/mob.html'));
});

/** 测试 */
router.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname,'../public/html/test.html'));
});

module.exports = router;