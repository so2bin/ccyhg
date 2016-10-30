SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- tbl_users 用户信息表
-- priv: 0000:root(管理用户与商品), 1000:管理商品,查看用户信息, 2000:管理商品, 3000: 查看商品
DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE IF NOT EXISTS `tbl_users` (
    `id` INT(11) DEFAULT NULL AUTO_INCREMENT COMMENT 'user ID',
    `ftime` VARCHAR(31) DEFAULT NULL COMMENT '注册时间',
    `priv` VARCHAR(11) DEFAULT 3000  COMMENT '权限',
    `username` VARCHAR(63) NOT NULL COMMENT '用户名',
    `password` VARCHAR(127) NOT NULL COMMENT '密码',
    `sex` INT(4) DEFAULT 0 COMMENT '性别',   -- 0男 1女
    `lastlogintime` VARCHAR(31) DEFAULT '0000/00/00 00:00:00' COMMENT '最近登陆时间',
    `collectnum` INT(8) DEFAULT 0 COMMENT '收藏物品件数',
    `collectgoods` VARCHAR(1024) DEFAULT NULL COMMENT '收藏物品ID列',  -- 10B+1B为1个ID标记, 最多收藏11B*50件<1024
    PRIMARY KEY(id)
) AUTO_INCREMENT=100000000 ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';