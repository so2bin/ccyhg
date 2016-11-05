/**
 * Created by heli on 2016/10/24 0024.
 */
const express   = require('express');
const router    = express.Router();
const path      = require('path');
const fs        = require('fs');
const BBPromise = require('bluebird');
const dbStore   = require('../db/index');

/* GET goods info in tbl_store */
router.get('/', function (req, res) {
  res.render('info', {
    title: 'CC优惠购'
  });
});

router.get('/listgoods', function (req, res) {
  var tblName = 'tbl_store';
  var sqlData = `SELECT id, ftime, type, subtype1, subtype2, title,
    step1, step2, realprice, coupon, collect, pic1, pic2, pic3
    FROM ${tblName} ORDER BY ftime`;

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT
    })
  ]).spread(function (sqlItems) {
    res.set('Content-Type', "application/json;charset=utf-8");
    let result = JSON.stringify({
      code: 0,
      msg : sqlItems
    });
    res.end(result);
  }).catch(function (err) {
    res.set('Content-Type', "application/json;charset=utf-8");
    console.log(err);
    res.end(JSON.stringify({
      code: 101,
      msg : `ERROR: ${err}`
    }));
  });
});

router.delete('/listgoods', function (req, res) {
  const id     = req.query.id;
  let tblName  = 'tbl_store';
  let sqlQuery = `SELECT * FROM ${tblName} WHERE id=$id`;
  let sqlData  = `DELETE FROM ${tblName} WHERE id=$id`;
  BBPromise.resolve([
    dbStore.sequelize.query(sqlQuery, {
      type: dbStore.sequelize.QueryTypes.SELECT,
      bind: {
        id: id
      }
    }),
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.DELETE,
      bind: {
        id: id
      }
    })
  ]).spread(function (item) {
    item = item[0];
    // 删除文件
    if(item.pic1){
      fs.unlink(`public${item.pic1}`);  //images/goodspic/100114776391685174.jpg'
    }
    if(item.pic2){
      fs.unlink(`public${item.pic2}`);
    }
    if(item.pic3){
      fs.unlink(`public${item.pic3}`);
    }

    res.set('Content-Type', "application/json;charset=utf-8");
    let result = JSON.stringify({
      code: 0
    });
    res.end(result);
  }).catch(function (err) {
    res.set('Content-Type', "application/json;charset=utf-8");
    let result = JSON.stringify({
      code: 101,
      msg : `ERROR: ${err}`
    });
    console.log(err);
    res.end(result);
  });
});

router.post('/', function (req, res) {
  res.set('Content-Type', "application/json;charset=utf-8");
  console.log(req.body);
  let result = JSON.stringify({
    code: 0,
    msg : '服务器处理成功'
  });
  res.end(result);
});

module.exports = router;

