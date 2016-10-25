SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- tbl_store 商场物品信息表
DROP TABLE IF EXISTS `tbl_store`;
CREATE TABLE IF NOT EXISTS `tbl_store` (
    `id` INT(11) AUTO_INCREMENT COMMENT '商品ID',
    `ftime` DATETIME DEFAULT NULL COMMENT '入库时间',
    `type` VARCHAR(63) NOT NULL COMMENT '主类型',
    `subtype1` VARCHAR(63) DEFAULT NULL COMMENT '子类型1',
    `subtype2` VARCHAR(63) DEFAULT NULL COMMENT '子类型2',
    `title` VARCHAR(255) NOT NULL COMMENT '主类型',
    `step1` VARCHAR(611) NOT NULL COMMENT '描述1',
    `step2` VARCHAR(611) DEFAULT NULL COMMENT '描述2',
    `realprice` FLOAT(10,2) NOT NULL COMMENT '劵后价格',
    `coupon` FLOAT(10,2) NOT NULL COMMENT '优惠价格',
    `pic1` VARCHAR(63) NOT NULL COMMENT '图片1',
    `pic2` VARCHAR(63) DEFAULT NULL COMMENT '图片2',
    `pic3` VARCHAR(63) DEFAULT NULL COMMENT '图片3',
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商场物品信息表';