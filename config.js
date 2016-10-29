/**
 * Created by duoyi on 16-8-16.
 */
var signConfig_hhm = {
  token         : 'hehongmeiyouhuigouzengxi',
  appid         : 'wxaa59b4dc0a186fad',
  encodingAESKey: 'w5uD4JlCx4ISd2Dvxgnmr2hW9Q9CXFeoTSWtfpZvE8V'
};
var appsecret_hhm  = '584190c079aff1d01a7b8a7ab4c3c0a5';

var signConfig_hbb = {
  token         : 'hehongmeiyouhuigouzengxi',
  appid         : 'wxc843698c533abc3b',
  encodingAESKey: 'qSmkCFQlpo803ewvuzpyHahsJ3t1LTA41VELIARdkuf'
};
var appsecret_hbb  = 'c314a2a18160d5e3cb30be901a2ec1d4';

module.exports = {
  cookieSecret: 'helibinbin_ccyhg_cookiescret',
  hhm         : {
    config: signConfig_hhm,
    secret: appsecret_hhm
  },
  hbb         : {
    config: signConfig_hbb,
    secret: appsecret_hbb
  },
  mysql       : {
    host      : "w.rdc.sae.sina.com.cn",
    port      : 3307,
    database  : "app_ccyhg",
    user      : "l0wjz0o22y",
    "password": "45l4jlw4x4m5mllwxxl31jk2ymi2iikk15j55khw"
  },
  // ubuntu duoyi
  mysql_local : {
    host          : "localhost",
    port          : 3306,
    database      : "ccyhg",
    user          : "hbb",
    password      : "mysqlhbb123456",
    maxConnections: 20
  },
  // 服务器ID 4位
  svrId       : 1001
};