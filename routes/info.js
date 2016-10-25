/**
 * Created by heli on 2016/10/24 0024.
 */
var express       = require('express');
var router        = express.Router();
var path          = require('path');
var BBPromise     = require('bluebird');
var selectContent = require('../config/selectConfig.js')
var dbStore       = require('../db/index');

/* GET goods info in tbl_store */
router.get('/', function (req, res) {
  var tblName = 'tbl_store';
  var sqlData = `SELECT * FROM ${tblName} ORDER BY ftime`;

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT
    })
  ]).spread(function (sqlItems) {
    console.log(sqlItems);

    res.render('info', {
      title: 'CC优惠购',
      msg  : sqlItems
    });
  }).catch(function (err) {
    console.log(err);
    res.end('ERROR' + err)
  });
});

router.post('/', function (req, res) {
  console.log(req.body)
  res.end('服务器处理成功');
});

module.exports = router;

