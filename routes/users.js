const express       = require('express');
const router        = express.Router();
const BBPromise     = require('bluebird');
const crypto        = require('crypto');
const dbModel       = require('../db/index');
const datefunctions = require('../tools/datefunction.js');
const regulation    = require('../config/regulations.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  var user = req.session.user;
  res.set('Content-Type', "application/json;charset=utf-8");
  if (!user) {
    res.end(JSON.stringify({
      code: 100,  // 没有登陆
      msg : regulation.ERRCODE[100]
    }));
  } else {
    // 验证用户是否有效

    res.end(JSON.stringify({
      code: 0,
      msg : `登陆成功`
    }))
  }
});

/*********************************************************
 * 处理登陆
 */
router.get('/login', function (req, res, next) {
  res.render('login', {});
});

router.post('/login', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const md5  = crypto.createHash('md5');
  const pswd = md5.update(password).digest('hex');

  const tblName      = 'tbl_users';
  const sqlQueryUser = `SELECT username, password, priv FROM ${tblName} WHERE username=$username`;
  BBPromise.resolve([
    dbModel.sequelize.query(sqlQueryUser, {
      type: dbModel.sequelize.QueryTypes.SELECT,
      bind: {
        username: username
      }
    })
  ]).spread(function (sqlUserRes) {
    console.log(sqlUserRes)
    res.set('Content-Type', "application/json;charset=utf-8");
    if (sqlUserRes.length === 0) {
      res.end(JSON.stringify({
        code: 200,  // 账号错误
        msg : regulation.ERRCODE[200]
      }));
    } else if (pswd != sqlUserRes[0].password) {
      res.end(JSON.stringify({
        code: 201,  // 密码错误
        msg : regulation.ERRCODE[201]
      }));
    } else {
      // 账号密码匹配成功，更新登陆时间，返回结果
      let nowDateStr         = datefunctions.dateFormat(new Date(), 'yyyy/MM/dd hh:mm:ss');
      const sqlUpUserLogTime = `UPDATE ${tblName} SET lastlogintime=${nowDateStr} WHERE username=$username`;
      dbModel.sequelize.query(sqlUpUserLogTime, {
        type: dbModel.sequelize.QueryTypes.UPDATE,
        bind: {
          username: username
        }
      }).then(function () {
        req.session.user = {
          username: username
        };
        res.end(JSON.stringify({
          code: 0,
          msg : `登陆成功`
        }))
      })
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
    res.set('Content-Type', "application/json;charset=utf-8");
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

module.exports = router;
