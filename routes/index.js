var express = require('express');
var crypto = require('crypto');
var router = express.Router();
const BBPromise     = require('bluebird');
const dbStore       = require('../db/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  var tblName = 'tbl_store';
  var sqlData = `SELECT id, ftime, type, subtype1, subtype2, title,
    step1, step2, realprice, coupon, collect, pic1, pic2, pic3
    FROM ${tblName} ORDER BY ftime`;

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT
    })
  ]).spread(function (sqlItems) {
    let result = [

    ];
    let items = JSON.stringify({
      msg: sqlItems
    });
    res.render('index',{title:'CC优惠购', items: result});
    //res.end(result);
  }).catch(function (err) {
    console.log(err);
    res.end('ERROR' + err)
  });
});

module.exports = router;
