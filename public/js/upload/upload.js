/**
 * Created by Administrator on 2016/10/2 0002.
 */
'use strict';
// 初始化时获得下来选择框在内容

$(function () {
    var selCon = null;
    var mainKeyVal = null, subKey1Val = null;
    $('#mainKey').selectmenu();
    $('#subKey1').selectmenu();
    $('#subKey2').selectmenu();
    // 根据主类更新子类
    $('#mainKey').selectmenu({
        change: function( event, ui ) {
            mainKeyVal = ui.item.value;
            $('#subKey1').children('option').remove();
            Object.keys(selCon[mainKeyVal]).forEach(function (subKey) {
                $('#subKey1').append('<option value='+subKey+'>'+subKey+'</option>');
            });
            $('#subKey1').selectmenu('refresh');
        }
    });
    $('#subKey1').selectmenu({
        change: function (event, ui) {
            subKey1Val = ui.item.value;
            // 子类2不为null
            $('#subKey2').children('option').remove();
            if(selCon[mainKeyVal][subKey1Val]!==null){
                Object.keys(selCon[mainKeyVal][subKey1Val]).forEach(function (subKey) {
                    $('#subKey2').append('<option value='+subKey+'>'+subKey+'</option>');
                });
            }else{
                $('#subKey2').append('<option value=""></option>');
            }
            $('#subKey2').selectmenu('refresh');
        }
    });
    // 获取类型配置
    if(selCon===null){
        $.ajax({
            url:'/upload?selectcontent=1',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                selCon = data;
                // 默认配置
                Object.keys(data).forEach(function (key) {
                    $('#mainKey').append('<option value='+key + '>'+key+'</option>');
                });
                // 子类1默认初始化
                Object.keys(selCon[Object.keys(data)[0]]).forEach(function (subKey) {
                    $('#subKey1').append('<option value='+subKey+'>'+subKey+'</option>');
                });
            }
        })
    };

    $('.submitButton input[type=submit]').button();

    $('#formSubmit').click(function () {
        $('form').ajaxSubmit({
            url: '/upload',
            type: 'POST',
            //data: $('form').serialize(),
            clearForm: false,
            resetForm: false,
            beforeSubmit: function (formDataa, jqForm, options) {
                $('#loading').dialog('open');
                return true;
            },
            success : function (responseText, statusText) {
                if(responseText){
                    $('#loading').css('color','green').html('数据提交成功...');
                    setTimeout(function(){
                        $('#loading').dialog('close');
                    },1000)
                }
            },
            error : function (event, errorText, errorType) { //错误时调用
                $('#loading').css('color','red').html('数据提交出错!');
                setTimeout(function(){
                    $('#loading').dialog('close');
                },1000)
            }
        });
    });

    $('#loading').dialog({
        modal : true,
        autoOpen : false,
        closeOnEscape : false, //按下 esc 无效
        resizable : false,
        draggable : false,
        width : 200,
        height: 50
    }).parent().parent().find('.ui-widget-header').hide();
});

