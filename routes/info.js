/**
 * Created by heli on 2016/10/24 0024.
 */
const express       = require('express');
const router        = express.Router();
const path          = require('path');
const BBPromise     = require('bluebird');
const selectContent = require('../config/selectConfig.js')
const dbStore       = require('../db/index');

/* GET goods info in tbl_store */
router.get('/', function (req, res) {
  res.render('info',{
    title: 'CC优惠购'
  });
});

router.get('/listgoods', function (req, res) {
  var tblName = 'tbl_store';
  var sqlData = `SELECT * FROM ${tblName} ORDER BY ftime`;

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT
    })
  ]).spread(function (sqlItems) {
    let result = JSON.stringify({
      msg: sqlItems
    });
    res.end(result);
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

