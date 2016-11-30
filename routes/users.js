const express       = require('express');
const router        = express.Router();
const BBPromise     = require('bluebird');
const crypto        = require('crypto');
const dbModel       = require('../db/index');
const datefunctions = require('../tools/datefunction.js');
const regulation    = require('../config/regulations.js');
const navConfig  = require('../config/selectConfig');

/*******************************************
 * 返回个人信息
 * */
router.get('/', function (req, res, next) {
  var user = req.session.user;
  // 前端ajax设定dataType: 'json', 这里可以不需要设定这个类型
  if (!user) {
    res.end(JSON.stringify({
      code: 100,  // 没有登陆
      msg : regulation.ERRCODE[100]
    }));
  } else {
    // 验证用户是否有效
    let tblName      = 'tbl_users';
    let sqlUserInfo = `SELECT * from ${tblName} WHERE id=$id`;
    BBPromise.resolve(
      dbModel.sequelize.query(sqlUserInfo, {
        type: dbModel.sequelize.QueryTypes.SELECT,
        bind: {
          id: user.id
        }
      })
    ).then(function (sqlUserRes) {
      if (sqlUserRes.length === 0) {
        res.end(JSON.stringify({
          code: 203,  // 账号错误
          msg : regulation.ERRCODE[203]
        }));
      } else {
        sqlUserRes = sqlUserRes[0];
        // 提取收藏的物品ID '|100001|100002|100003|'
        let resColGoods = [];
        let result = {
          id          : sqlUserRes.id,
          username    : sqlUserRes.username,
          sex         : sqlUserRes.sex===0? '男':'女',
          collectNum  : sqlUserRes.collectnum,
          collectgoods: resColGoods
        };

        let gdsId = sqlUserRes.collectgoods.slice(1,-1);
        // 有收藏物品
        if(gdsId!==''){
           gdsId = `("${gdsId.replace(/\|/g,'","')}")`;
          // collects = sqlUserRes.collectgoods.split('|').slice(1).map(x=>parseInt(x));
          let tblGoods = 'tbl_store';
          let sqlCollects = `SELECT * FROM ${tblGoods} WHERE id IN ${gdsId}`;

          dbModel.sequelize.query(sqlCollects, {
            type: dbModel.sequelize.QueryTypes.SELECT,
          }).then(function (sqlColRes) {
            sqlColRes.forEach(function (col) {
              resColGoods.push(col);
            });
            res.end(JSON.stringify({
              code: 0,
              msg : result
            }))
          }).catch(function (err) {
            res.end(JSON.stringify({
              code: 110,
              msg : `ERROR: ${err}`
            }))
          });
        }
        // 没有收藏物品
        else{
          res.end(JSON.stringify({
            code: 0,
            msg : result
          }))
        }
      }
    }).catch(function (err) {
      console.log(err);
      res.end(JSON.stringify({
        code: 101,
        msg: 'ERROR' + err}))
    });
  }
});

/*********************************************************
 * 处理登陆
 */
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'CC优惠购',
    navJson: navConfig.selects
  });
});

router.post('/login', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const md5  = crypto.createHash('md5');
  const pswd = md5.update(password).digest('hex');

  const tblName      = 'tbl_users';
  const sqlQueryUser = `SELECT id, username, password, priv, sex, 
        lastlogintime FROM ${tblName} WHERE username=$username`;
  BBPromise.resolve([
    dbModel.sequelize.query(sqlQueryUser, {
      type: dbModel.sequelize.QueryTypes.SELECT,
      bind: {
        username: username
      }
    })
  ]).spread(function (sqlUserRes) {
    let item = sqlUserRes[0];
    if (sqlUserRes.length === 0) {
      res.end(JSON.stringify({
        code: 200,  // 账号错误
        msg : regulation.ERRCODE[200]
      }));
    } else if (pswd != item.password) {
      res.end(JSON.stringify({
        code: 201,  // 密码错误
        msg : regulation.ERRCODE[201]
      }));
    } else {
      // 账号密码匹配成功，更新登陆时间，返回结果
      let nowDateStr         = datefunctions.dateFormat(new Date(), 'yyyy/MM/dd hh:mm:ss');
      const sqlUpUserLogTime = `UPDATE ${tblName} SET lastlogintime=$nowDateStr WHERE username=$username`;
      dbModel.sequelize.query(sqlUpUserLogTime, {
        type: dbModel.sequelize.QueryTypes.UPDATE,
        bind: {
          username  : username,
          nowDateStr: nowDateStr
        }
      }).then(function () {
        req.session.user = {
          id           : item.id,
          username     : username,
          sex          : item.sex,
          lastlogintime: item.lastlogintime
        };
        res.end(JSON.stringify({
          code: 0,
          msg : `登陆成功`
        }))
      }).catch(function (err) {
        res.end(JSON.stringify({
          code: 110,
          msg : `ERROR: ${err}`
        }))
      });
    }
  }).catch(function (err) {
    res.end(JSON.stringify({
      code: 110,
      msg : `ERROR: ${err}`
    }))
  });

});

/********************************************************
 *  处理注册
 */
router.post('/reg', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const sex      = req.body.sex;

  const md5  = crypto.createHash('md5');
  const pswd = md5.update(password).digest('hex');

  const tblName      = 'tbl_users';
  const sqlQueryUser = `SELECT username FROM ${tblName} WHERE username=$username`;
  BBPromise.resolve([
    dbModel.sequelize.query(sqlQueryUser, {
      type: dbModel.sequelize.QueryTypes.SELECT,
      bind: {
        username: username
      }
    })
  ]).spread(function (sqlUserRes) {
    if (sqlUserRes.length !== 0) {
      res.end(JSON.stringify({
        code: 202,  // 账号重复
        msg : '用户账号已经存在'
      }));
    } else {
      // 注册成功
      let nowDateStr   = datefunctions.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
      const sqlRegUser = `INSERT INTO ${tblName} VALUES (0, $nowDateStr, ${regulation.PRIV.goods}, 
            $username, $password, $sex, $nowDateStr, 0, "|")`;
      dbModel.sequelize.query(sqlRegUser, {
        type: dbModel.sequelize.QueryTypes.INSERT,
        bind: {
          username  : username,
          password  : pswd,
          sex       : sex,
          nowDateStr: nowDateStr
        }
      }).then(function () {
        req.session.user = {
          username: username
        };
        res.end(JSON.stringify({
          code: 0,
          msg : `注册成功`
        }))
      }).catch(function (err) {
        res.end(JSON.stringify({
          code: 110,
          msg : `ERROR: ${err}`
        }))
      });
    }
  }).catch(function (err) {
    res.end(JSON.stringify({
      code: 110,
      msg : `ERROR: ${err}`
    }))
  });
});

/**
 * 处理登出
 */
router.get('/loginout',function (req, res, next) {
  if(req.session.user){
    req.session.user = null;
  }
  res.end(JSON.stringify({code:0, msg:'登出成功'}));
});

module.exports = router;
