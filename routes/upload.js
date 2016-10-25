/**
 * Created by heli on 16-8-23.
 */
const express       = require('express');
const router        = express.Router();
const path          = require('path');
const selectContent = require('../config/selectConfig.js')
const BBPromise     = require('bluebird');
const dbStore       = require('../db/index');

/* GET users listing. */
router.get('/', function (req, res) {
  if (req.query.selectcontent == true) {
    res.json(selectContent.selects);
  } else {
    res.render('upload', {
      title: 'CC优惠购'
    });
  }
});

router.post('/', function (req, res) {
  const type      = req.body.mainKey;
  const subtype1  = req.body.subKey1;
  const subtype2  = req.body.subKey2;
  const title     = req.body.goodstitle;
  const step1     = req.body.step1;
  const step2     = req.body.step2;
  const realPrice = req.body.realPrice;
  const coupon    = req.body.coupon;
  const pic1      = req.body.pic1 || "no pic1";
  const pic2      = req.body.pic2 || "no pic2";
  const pic3      = req.body.pic3 || "no pic3";
  const pics      = req.body.pics;

  console.log(req.body, pics);

  const tblName       = 'tbl_store';
  const sqlInsertData = `INSERT INTO ${tblName} VALUES (
        0, NOW(), $type, $subtype1, $subtype2, $title, $step1, $step2, $realPrice,
        $coupon, $pic1, $pic2, $pic3 )`;
  BBPromise.resolve([
    dbStore.sequelize.query(sqlInsertData, {
      type: dbStore.sequelize.QueryTypes.INSERT,
      bind: {
        type     : type,
        subtype1 : subtype1,
        subtype2 : subtype2,
        title    : title,
        step1    : step1,
        step2    : step2,
        realPrice: realPrice,
        coupon   : coupon,
        pic1     : pic1,
        pic2     : pic2,
        pic3     : pic3
      }
    })
  ]).spread(function (data) {
    //console.log(data);
    res.end('服务器处理成功');
  }).catch(function (err) {
    console.log(err);
    res.end('ERROR' + err)
  });
});

module.exports = router;