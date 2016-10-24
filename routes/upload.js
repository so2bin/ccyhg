/**
 * Created by heli on 16-8-23.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var selectContent = require('../config/selectConfig.js')


/* GET users listing. */
router.get('/', function(req, res) {
    if(req.query.selectcontent==true){
        res.json(selectContent.selects);
    }else{
        res.render('upload',{
            title: 'CC优惠购'
        });
    }
});

router.post('/',function (req, res) {
    console.log(req.body)
    res.end('服务器处理成功');
});

module.exports = router;