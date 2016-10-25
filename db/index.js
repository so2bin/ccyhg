var config = require('../config');
var Sequelize = require('sequelize');
var path = require('path');

var db = {};

var sqlConfig = config.mysql_local;

// var DB = mysql.createConnection({
//     host    : sqlConfig.host,
//     port    : sqlConfig.port,
//     user    : sqlConfig.user,
//     password: sqlConfig.password,
//     database: sqlConfig.database
// });

// DB.query('show databases',function(err,rows){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(rows)
//     }
// });


var sequelize = new Sequelize(sqlConfig.database
    ,sqlConfig.user, sqlConfig.password, {
        host: sqlConfig.host,
        port: sqlConfig.port,
        dialect: 'mysql',
        timezone: 'Asia/Shanghai',
        pool:{
            maxConnections: sqlConfig.maxConnections
        }
    });

db['GoodsStore'] = sequelize.import(path.join(__dirname, 'tbl_store.js'));

module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
};