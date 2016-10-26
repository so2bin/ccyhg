/**
 * Created by heli on 16-8-23.
 */
const express       = require('express');
const router        = express.Router();
const path          = require('path');
const selectContent = require('../config/selectConfig.js')
const BBPromise     = require('bluebird');
const multiparty    = require('multiparty');
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
  const form = new multiparty.Form();
  form.parse(req, function (err, objs, values) {
    const type      = objs.mainKey === undefined ? null : objs.mainKey[0];
    const subtype1  = objs.subKey1[0];
    const subtype2  = objs.subKey2 === undefined ? null : objs.subKey2[0];
    const title     = objs.goodstitle[0];
    const step1     = objs.step1[0];
    const step2     = objs.step2[0];
    const realPrice = objs.realPrice[0];
    const coupon    = objs.coupon[0];
    const collect   = objs.collect === undefined ? 0 : objs.collect[0];
    const pic1      = objs.file0 === undefined ? null : objs.file0[0];
    const pic2      = objs.file1 === undefined ? null : objs.file1[0];
    const pic3      = objs.file2 === undefined ? null : objs.file2[0];

    const tblName       = 'tbl_store';
    const sqlInsertData = `INSERT INTO ${tblName} VALUES (
        0, NOW(), $type, $subtype1, $subtype2, $title, $step1, $step2, $realPrice,
        $coupon, $collect, $pic1, $pic2, $pic3 )`;
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
          collect  : collect,
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

});

module.exports = router;