/**
 * Created by Administrator on 2016/9/10 0010.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
  sequelize.define('Users', {
    id           : {
      field        : 'id',
      type         : DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey   : true
    },
    ftime        : {
      field  : 'ftime',
      type   : DataTypes.STRING(31),
      comment: '注册时间'
    },
    priv         : {
      field       : 'priv',
      type        : DataTypes.STRING(11),
      defaultValue: 3000,
      comment     : '权限'
    },
    username     : {
      field    : 'username',
      type     : DataTypes.STRING(63),
      allowNull: false,
      comment  : '用户名'
    },
    password     : {
      field    : 'password',
      type     : DataTypes.STRING(127),
      allowNull: false,
      comment  : '密码'
    },
    sex          : {
      field       : 'sex',
      type        : DataTypes.INTEGER(4),
      defaultValue: 0,
      comment     : '性别'
    },
    lastlogintime: {
      field  : 'lastlogintime',
      type   : DataTypes.STRING(31),
      comment: '最近登陆时间'
    },
    collectnum   : {
      field       : 'collectnum',
      type        : DataTypes.INTEGER(8),
      defaultValue: 0,
      comment     : '收藏物品数'
    },
    collectgoods : {
      field    : 'collectgoods',
      type     : DataTypes.STRING(1024),
      allowNull: true,
      comment  : '收藏物品ID列'
    }
  }, {
    tblName        : 'tbl_users',
    freezeTableName: true
  })
};