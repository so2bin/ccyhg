/**
 * Created by duoyi on 16-8-16.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var API = require('wechat-api');
var wechat = require('wechat');
var config = require('../config.js');
var menu = require('../wechat/wechat-menu.json');
var msg = require('../wechat/msg.json')
var text = require('../controller/dealText')
var db = require('../db/mysql')

var api = new API(config.hbb.config.appid, config.hbb.secret);

router.all('/', wechat(config.hhm.config, function (req, res, next) {
    api.createMenu(menu, function(err, result){

    });
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    var msgType = message.MsgType;
    if(msgType== 'event'){
        var eventType = message.Event;
        if(eventType){
            eventType = eventType.toLowerCase();
        }
        if(eventType=='subscribe'){
            res.reply(
                msg.subscribeMsg
            )
        }else if(eventType=='click'){

        }else{
            
        }
    }
    if(msgType=='text'){
        // 回复高富帅(图文回复)
        var result = text(message.Content);
        res.reply({
            type : "text",
            content : "nihao, <a href='http://1.ccyhg.applinzi.com/images/2D.jpg'>hehe</a》"
        });
    }
    /*
    if (message.FromUserName === 'java') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else if(message.MsgType=='news'){
        res.reply({
            type : "text",
            content : [{
                title: message.Content,
                description: '小二为您找来如下优惠信息',
                picurl: 'http://1.ccyhg.applinzi.com/images/2D.jpg',
                url: 'http://1.ccyhg.applinzi.com/users'
            }]
        });
    }
    }else {
        // 回复高富帅(图文回复)
        res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://1.ccyhg.applinzi.com/images/2D.jpg',
                url: 'http://1.ccyhg.applinzi.com/users'
            }
        ]);
    }
    */
}));

module.exports = router;