/*********************************************************
 *
 * 定义各种过返回状态码的意义
 *
 */

module.exports.ERRCODE = {
  0  : '成功',
  100: '没有登陆',

  110: '服务器运行报错',

  200: '账号无效',
  201: '密码错误',
  202: '账号已经存在',
  203: '账号过期'

};

module.exports.PRIV = {
  root        : '0000',
  goodsUserMgr: '1000',
  goodsMgr    : '2000',
  goods       : '3000'
};

module.exports.SEX = {
  male  : 0,
  female: 1
};