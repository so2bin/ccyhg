CREATE TABLE IF NOT EXISTS goodsInfo (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `MainClass` varchar(20) NOT NULL,  #物品大类
    `Key1` varchar(20), #关键字1-5
    `Key2` varchar(20),
    `Key3` varchar(20),
    `Key4` varchar(20),
    `Key5` varchar(20),
    `Info1` text,  #物品描述1
    `Info2` text,   #物品描述2
    `P1` varchar(128) DEFAULT NULL,  #图片路径1
    `P2` varchar(128) DEFAULT NULL,  #图片路劲2
    `P3` varchar(128) DEFAULT NULL,  #图片路劲3
    `P4` varchar(128) DEFAULT NULL,  #图片路劲4
    `time` datetime DEFAULT NOW(),
    PRIMARY KEY(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;  

INSERT INTO goodsInfo values(0,"生活用品","洗发水","瑞虎","染发剂",NULL,NULL,"第一步:领取优惠券  天猫瑞虎清水一洗黑染发剂 【淘抢购】同步，领券后【15元】 优惠券￥AAIXLUzd￥","第二步:购买产品下单复制这条信息，打开→手机淘宝→即可看到【瑞虎清水一洗黑染发剂 植物自然黑头发洗发水天然黑色纯遮白发膏】￥AAIXLgRX￥ 清水黑发 温和配方 操作方便 省钱省事 告别白发苦恼",NULL,NULL,NULL,NULL,NOW());
INSERT INTO goodsInfo values(0,"生活用品","真空保温杯","不锈钢","名锐保温杯",NULL,NULL,"第一步:领取优惠券  便携真空不锈钢保温杯 天猫领券后【15.9元】包邮 速抢！优惠券：￥AAIXLPUF￥","第二步:购买产品下单：复制这条信息，打开→手机淘宝→即可看到【名锐保温杯男女士真空不锈钢便携儿童学生礼品茶杯子定制刻字水杯】￥AAIXLiCI￥ 304不锈钢，保温12小时密封不漏水",NULL,NULL,NULL,NULL,NOW());