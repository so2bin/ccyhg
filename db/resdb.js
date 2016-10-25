/**
 * Created by Administrator on 2016/9/10 0010.
 */
/*
var path = require('path');
var Sequelize = require('sequelize');
var config = require('../config');
var sqlConfig = config.mysql_local;
var sequelize = new Sequelize(sqlConfig.database,sqlConfig.user, sqlConfig.password,{
        host: sqlConfig.host,
        dialect:'mysql',
        pool: {
            max: 10,
            min: 0,
            idle: 1000
        }
    });

var db = {};

db['Store'] = require(path.join(__dirname,'tbl_store.js'))(sequelize, Sequelize);

module.exports.resModel = db;
  */