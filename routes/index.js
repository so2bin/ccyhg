var express      = require('express');
var crypto       = require('crypto');
var router       = express.Router();
const BBPromise  = require('bluebird');
const dbStore    = require('../db/index');
const ruleConfig = require('../config/regulations');
const navConfig  = require('../config/selectConfig');

/* GET home page. */
router.get('/', function (req, res, next) {
  var tblName = 'tbl_store';
  var sqlData = `SELECT id, ftime, type, subtype1, subtype2, title,
    step1, step2, realprice, coupon, collect, pic1, pic2, pic3
    FROM ${tblName} ORDER BY ftime`;
  // 增加用户信息查询,用于判断用户是否收藏有当前的物品
  let sqlUser = `SELECT * FROM tbl_users WHERE id=$id`;
  let id      = req.session.user ? req.session.user.id : -1;  // -1即差不多用户

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT
    }),
    dbStore.sequelize.query(sqlUser, {
      type: dbStore.sequelize.QueryTypes.SELECT,
      bind: {
        id: id
      }
    })
  ]).spread(function (sqlItems, sqlUserRes) {
    // 提取出当前用户所有收藏物品ID
    let collectIds = {};
    sqlUserRes     = sqlUserRes[0];
    if (sqlUserRes) {
      sqlUserRes = sqlUserRes.collectgoods.split('|').slice(1, -1);
      sqlUserRes.forEach(function (goodId) {
        collectIds[goodId] = true;
      });
    }

    let result = [];
    sqlItems.forEach(function (itm, idx) {
      // 标记为收藏
      if (collectIds[itm.id]) {
        itm.bCollected = true;
      }
      result.push(itm);
    });
    res.render('index', {title: 'CC优惠购', items: result, navJson: navConfig.selects});
  }).catch(function (err) {
    console.log(err);
    res.end('ERROR' + err)
  });
});

router.get('/collect', function (req, res, next) {
  var user = req.session.user;
  if (!user) {
    res.end(JSON.stringify({
      code: 100,  // 没有登陆
      msg : ruleConfig.ERRCODE[100]
    }));
  }

  let id      = req.query.id;
  let tblName = 'tbl_store';
  let sqlData = `SELECT id from ${tblName} WHERE id=$id`;

  dbStore.sequelize.query(sqlData, {
    type: dbStore.sequelize.QueryTypes.SELECT,
    bind: {
      id: id
    }
  }).then(function (sqlRes) {
    if (sqlRes.length == 0) {
      // 物品失效(数据空中已经删除)
      res.end(JSON.stringify({
        code: 120,
        msg : ruleConfig.ERRCODE[120]
      }))
    } else {
      // 在用户信息中添加收藏物品ID,如'10000|'
      let tblUser   = 'tbl_users';
      let sqlUpUser = `UPDATE ${tblUser} SET collectgoods=CONCAT(collectgoods, $newId) WHERE id=$userId`;
      dbStore.sequelize.query(sqlUpUser, {
        type: dbStore.sequelize.QueryTypes.UPDATE,
        bind: {
          newId : `${id}|`,
          userId: user.id
        }
      }).then(function () {
        res.end(JSON.stringify({
          code: 0,
          msg : '收藏成功'
        }))
      }).catch(function (err) {
        res.end(JSON.stringify({
          code: 110,
          msg : '收藏失败'
        }))
      });
    }
  }).catch(function (err) {
    console.log(err)
    res.end(JSON.stringify({
      code: 110,
      msg : '收藏失败'
    }))
  });
});

router.get('/uncollect', function (req, res, next) {
  var user = req.session.user;
  if (!user) {
    res.end(JSON.stringify({
      code: 100,  // 没有登陆
      msg : ruleConfig.ERRCODE[100]
    }));
  }

  let id      = req.query.id;
  let tblName = 'tbl_store';
  let tblUser = 'tbl_users';
  let sqlData = `SELECT id from ${tblName} WHERE id=$id`;
  let sqlUser = `SELECT * from ${tblUser} WHERE id=$userId`;

  BBPromise.resolve([
    dbStore.sequelize.query(sqlData, {
      type: dbStore.sequelize.QueryTypes.SELECT,
      bind: {
        id: id
      }
    }),
    dbStore.sequelize.query(sqlUser, {
      type: dbStore.sequelize.QueryTypes.SELECT,
      bind: {
        userId: user.id
      }
    })
  ]).spread(function (sqlDataRes, sqlUserRes) {
    if (sqlDataRes.length == 0) {
      // 物品失效(数据空中已经删除)
      res.end(JSON.stringify({
        code: 120,
        msg : ruleConfig.ERRCODE[120]
      }))
    }
    // 从用户信息中取消收藏物品ID,如'10000|'
    let userCollects = sqlUserRes[0].collectgoods;
    userCollects     = userCollects.replace(new RegExp(id + '\\\|', 'g'), "");

    let sqlUpUser = `UPDATE ${tblUser} SET collectgoods="${userCollects}" WHERE id=$userId`;

    dbStore.sequelize.query(sqlUpUser, {
      type: dbStore.sequelize.QueryTypes.UPDATE,
      bind: {
        userId: user.id
      }
    }).then(function () {
      res.end(JSON.stringify({
        code: 0,
        msg : '收藏成功'
      }))
    }).catch(function (err) {
      res.end(JSON.stringify({
        code: 110,
        msg : '收藏失败'
      }))
    });
  }).catch(function (err) {
    console.log(err)
    res.end(JSON.stringify({
      code: 110,
      msg : '收藏失败'
    }))
  });
});

module.exports = router;
