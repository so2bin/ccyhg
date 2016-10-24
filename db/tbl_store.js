/**
 * Created by Administrator on 2016/9/10 0010.
 */
'use strict';
module.exports = function (sequelize, DataTypes) {
    sequelize.define('Store',{
        id: {
            field: 'id',
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            unique: true
        },
        type: {
            field: 'type',
            type: DataTypes.STRING(63),
            allownull: false,
            comment: '主类型'
        },
        subtype1:{
            field: 'subtype1',
            type: DataTypes.STRING(63),
            allownull: true,
            comment: '子类型1'
        },
        subtype2:{
            field: 'subtype2',
            type: DataTypes.STRING(63),
            allownull: true,
            comment: '子类型2'
        },
        title:{
            field: 'title',
            type: DataTypes.STRING(255),
            allownull: false,
            comment: '商品描述信息'
        },
        step1: {
            field: 'step1',
            type: DataTypes.STRING(611),
            allownull: false,
            comment: '描述1'
        },
        step2: {
            field: 'step2',
            type: DataTypes.STRING(611),
            allownull: false,
            comment: '描述2'
        },
        realPrice: {
            field: 'realPrice',
            type: DataTypes.INTEGER(11),
            allownull: false,
            defaultValue: 0,
            comment: '券后价格'
        },
        coupon: {
            field: 'coupon',
            type: DataTypes.INTEGER(11),
            allownull: false,
            comment: '优惠价格'
        },
        pic1:{
            field: 'pic1',
            type: DataTypes.STRING(63),
            allownull: true,
            comment: '图片1'
        },
        pic2:{
            field: 'pic2',
            type: DataTypes.STRING(63),
            allownull: true,
            comment: '图片2'
        },
        pic3:{
            field: 'pic1',
            type: DataTypes.STRING(63),
            allownull: true,
            comment: '图片3'
        }
    },{
        tblName: 'tbl_store',
        createAt: 'ftime',
        freezeTableName: true
    })
};