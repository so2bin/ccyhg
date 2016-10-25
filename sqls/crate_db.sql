DROP TABLE IF EXISTS `tbl_store`;
CREATE TABLE `tbl_store` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `type` varchar(63) NOT NULL  COMMENT '主类型',
    `subtype1` varchar(63) COMMENT '子类型1',
    `subtype2` varchar(63) COMMENT '子类型2',
    `title` varchar(255) NOT NULL COMMENT '商品描述信息',
    `step1` varchar(611) NOT NULL COMMENT '描述1',
    `step2` varchar(611) NOT NULL COMMENT '描述2',
    `realPrice` int(11) NOT NULL COMMENT '券后价格',
    `coupon` int(11) NOT NULL COMMENT '优惠价格',
    `pic1` varchar(63) COMMENT '图片1',
    `pic2` varchar(63) COMMENT '图片2',
    `pic3` varchar(63) COMMENT '图片3',
    `ftime` datetime DEFAULT NOW() COMMENT '修改时间yy:mm:dd',
    UNIQUE (id)
) ENGINE=InnoDB CHARSET=utf8;
