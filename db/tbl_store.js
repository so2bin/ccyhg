/**
 * Created by Administrator on 2016/9/10 0010.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
    sequelize.define('GoodsStore',{
        id: {
            field: 'id',
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            field: 'type',
            type: DataTypes.STRING(63),
            allowNull: false,
            comment: '主类型'
        },
        subtype1:{
            field: 'subtype1',
            type: DataTypes.STRING(63),
            allowNull: true,
            comment: '子类型1'
        },
        subtype2:{
            field: 'subtype2',
            type: DataTypes.STRING(63),
            allowNull: true,
            comment: '子类型2'
        },
        title:{
            field: 'title',
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: '商品描述信息'
        },
        step1: {
            field: 'step1',
            type: DataTypes.STRING(611),
            allowNull: false,
            comment: '描述1'
        },
        step2: {
            field: 'step2',
            type: DataTypes.STRING(611),
            allowNull: false,
            comment: '描述2'
        },
        realPrice: {
            field: 'realPrice',
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            comment: '券后价格'
        },
        coupon: {
            field: 'coupon',
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: '优惠价格'
        },
        collect: {
            field: 'collect',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            comment: '收藏数'
        },
        pic1:{
            field: 'pic1',
            type: DataTypes.STRING(63),
            allowNull: true,
            comment: '图片1'
        },
        pic2:{
            field: 'pic2',
            type: DataTypes.STRING(63),
            allowNull: true,
            comment: '图片2'
        },
        pic3:{
            field: 'pic1',
            type: DataTypes.STRING(63),
            allowNull: true,
            comment: '图片3'
        }
    },{
        tblName: 'tbl_store',
        createAt: 'ftime',
        freezeTableName: true
    })
};