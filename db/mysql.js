var config = require('../config');
var mysql = require('mysql');

var sqlConfig = config.mysql;

var DB = mysql.createConnection({
    host    : sqlConfig.host,
    port    : sqlConfig.port,
    user    : sqlConfig.user,
    password: sqlConfig.password,
    database: sqlConfig.database
});
/*
DB.query('show databases',function(err,rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows)
    }
});
*/

