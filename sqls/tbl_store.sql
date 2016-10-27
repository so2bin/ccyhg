SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- tbl_store 商场物品信息表
DROP TABLE IF EXISTS `tbl_store`;
CREATE TABLE IF NOT EXISTS `tbl_store` (
    `id` INT(11) DEFAULT NULL AUTO_INCREMENT COMMENT '商品ID',
    `ftime` DATETIME DEFAULT NULL COMMENT '入库时间',
    `type` VARCHAR(63) NOT NULL COMMENT '主类型',
    `subtype1` VARCHAR(256) DEFAULT NULL COMMENT '子类型1',
    `subtype2` VARCHAR(256) DEFAULT NULL COMMENT '子类型2',
    `title` VARCHAR(512) NOT NULL COMMENT '标题',
    `step1` VARCHAR(512) NOT NULL COMMENT '描述1',
    `step2` VARCHAR(512) DEFAULT NULL COMMENT '描述2',
    `realprice` FLOAT(10,2) NOT NULL COMMENT '劵后价格',
    `coupon` FLOAT(10,2) NOT NULL COMMENT '优惠价格',
    `collect` INT(11) DEFAULT 0 COMMENT '收藏数',
    `pic1` VARCHAR(63) DEFAULT NULL COMMENT '图片1',
    `pic2` VARCHAR(63) DEFAULT NULL COMMENT '图片2',
    `pic3` VARCHAR(63) DEFAULT NULL COMMENT '图片3',
    PRIMARY KEY(id)
) AUTO_INCREMENT=1000000 ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商场物品信息表';