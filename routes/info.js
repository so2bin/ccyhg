/**
 * Created by heli on 2016/10/24 0024.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var selectContent = require('../config/selectConfig.js')


/* GET users listing. */
router.get('/', function(req, res) {
    res.render('info',{
        title: 'CC优惠购'
    });
});

router.post('/',function (req, res) {
    console.log(req.body)
    res.end('服务器处理成功');
});

module.exports = router;

