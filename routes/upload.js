/**
 * Created by heli on 16-8-23.
 */
const express       = require('express');
const router        = express.Router();
const fs            = require("fs");
const path          = require('path');
const selectContent = require('../config/selectConfig.js')
const BBPromise     = require('bluebird');
const multiparty    = require('multiparty');
const dbStore       = require('../db/index');
const config        = require('../config');

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

    // 保存图片到本地images/goodspic/目录下 返回路径
    let storePics = [];
    if (pic1 !== null) storePics.push(pic1);
    if (pic2 !== null) storePics.push(pic2);
    if (pic3 !== null) storePics.push(pic3);

    const picsContents = storeGoodsPics(storePics);

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
          pic1     : picsContents[0] === undefined ? null : picsContents[0],
          pic2     : picsContents[1] === undefined ? null : picsContents[1],
          pic3     : picsContents[2] === undefined ? null : picsContents[2]
        }
      })
    ]).spread(function () {
      res.set('Content-Type',"application/json;charset=utf-8");
      res.end(JSON.stringify({
        code: 0,
        msg : '图片存储成功'
      }));
    }).catch(function (err) {
      res.set('Content-Type',"application/json;charset=utf-8");
      console.log(err);
      res.end(JSON.stringify({
        code: 110,
        msg : `ERROR: ${err}`
      }))
    });
  });

});

/**
 * 根据服务器ID(4位) + 时间戳(14位) + 自增数字产生UID数字
 */
let uid_incr = 0;
function generateUIDName() {
  return config.svrId.toString() + new Date().getTime().toString() + (++uid_incr);
}

/**
 * 保存图片到本地images/goodspic/目录下
 * 返回存储路径（包括新定义的随机名字）
 * @param pics
 */
function storeGoodsPics(pics) {
  let rePicsContent = [];
  pics.forEach(function (picBase64) {
    // 将data:image/png;base64,这段内容过滤掉
    picBase64      = picBase64.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(picBase64, 'base64');
    let picName    = generateUIDName();
    rePicsContent.push(`/images/goodspic/${picName}.jpg`);
    console.log(picName);
    fs.writeFile(`public/images/goodspic/${picName}.jpg`, dataBuffer, function (err) {
      if (err) {
        throw `ERROR: Store picture dataUrl as jpg failed! Check the formation of picture is .jpg`;
      } else {
        console.log(`stored as file ${picName}.jpg`)
      }
    })
  });
  return rePicsContent;
}

module.exports = router;