/**
 * Created by Administrator on 2016/10/2 0002.
 */
'use strict';
/*********************************************************************************/
// 按钮，对话框等初始化
// 初始化时获得下来选择框在内容
$(function () {
  var selCon     = null;
  var mainKeyVal = null, subKey1Val = null;
  $('#mainKey').selectmenu();
  $('#subKey1').selectmenu();
  $('#subKey2').selectmenu();
  // 根据主类更新子类
  $('#mainKey').selectmenu({
    change: function (event, ui) {
      mainKeyVal = ui.item.value;
      $('#subKey1').children('option').remove();
      Object.keys(selCon[mainKeyVal]).forEach(function (subKey) {
        $('#subKey1').append('<option value=' + subKey + '>' + subKey + '</option>');
      });
      $('#subKey1').selectmenu('refresh');
    }
  });
  $('#subKey1').selectmenu({
    change: function (event, ui) {
      subKey1Val = ui.item.value;
      // 子类2不为null
      $('#subKey2').children('option').remove();
      if (selCon[mainKeyVal][subKey1Val] !== null) {
        Object.keys(selCon[mainKeyVal][subKey1Val]).forEach(function (subKey) {
          $('#subKey2').append('<option value=' + subKey + '>' + subKey + '</option>');
        });
      } else {
        $('#subKey2').append('<option value=""></option>');
      }
      $('#subKey2').selectmenu('refresh');
    }
  });
  // 获取类型配置
  if (selCon === null) {
    $.ajax({
      url     : '/upload?selectcontent=1',
      type    : 'GET',
      dataType: 'json',
      success : function (data) {
        selCon = data;
        // 默认配置
        Object.keys(data).forEach(function (key) {
          $('#mainKey').append('<option value=' + key + '>' + key + '</option>');
        });
        // 子类1默认初始化
        Object.keys(selCon[Object.keys(data)[0]]).forEach(function (subKey) {
          $('#subKey1').append('<option value=' + subKey + '>' + subKey + '</option>');
        });
      }
    })
  }
  ;

  $('.submitButton input[type=submit]').button();

  $('#loading').dialog({
    modal        : true,
    autoOpen     : false,
    closeOnEscape: false, //按下 esc 无效
    resizable    : false,
    draggable    : false,
    width        : 200,
    height       : 50
  }).parent().parent().find('.ui-widget-header').hide();
});

// 导航条激活颜色
$(function () {
  $('.navbar a[href=\"' + window.location.pathname + '\"]').addClass('activeNav');
});

/************************************************************************************/
// 初始化图片上传插件   该插件下载已经没有使用，用的是自己的canvas实现的压缩，上传功能
var pics = null;
$(function () {
  // 初始化插件
  pics = $("#picUpload").zyUpload({
    width     : '400px',                 // 宽度
    height    : "280px",                 // 宽度
    itemWidth : "120px",                 // 文件项的宽度
    itemHeight: "100px",                 // 文件项的高度
    url       : "/upload",  // 上传文件的路径
    multiple  : true,                    // 是否可以多个文件上传
    dragDrop  : true,                    // 是否可以拖动上传文件
    del       : true,                    // 是否可以删除文件
    finishDel : false,  				  // 是否在上传文件完成后删除预览
  });
});

/***************************************************************************************/
// 点击上传数据
/***
 * 压缩图片到100K
 * @param img
 */
function compressPic(img) {
  let cpRatio = 1;
  let dstSize = 100000; // 100KB
  // 大于100KB才进行压缩
  if(img.src.length>dstSize){
    cpRatio = img.src.length/dstSize;
  }
  return cpRatio;
}

// init upload data
let fileList  = null;
let formFiles = {};

// 选择图片 形成缩略图
$('#file-input').on('change', function () {
  formFiles = {};
  fileList  = this.files;        // FileList {0: File, 1: File, length: 2}
  let flag  = 0;
  for (var idx = 0; idx < fileList.length; ++idx) {
    let file   = fileList[idx];
    let reader = new FileReader();
    let img = new Image();
    // 读取原图为data url
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      img.src = e.target.result;
      console.log('file original length:'+e.target.result.length)
    };
    // canvas展示缩略图
    let $canvas = $('<canvas></canvas>');
    $canvas.appendTo('#previewPic');
    $canvas.addClass('thumbnail');
    let cnv = $canvas[0];
    let context = cnv.getContext('2d');

    // img获得数据, 生成压缩图，画缩略图
    img.onload = function () {
      let ratio = compressPic(img);

      context.drawImage(img,0,0,300,150);
      let canUrl = cnv.toDataURL("image/jpeg", 0.96);
      formFiles['file' + (flag++)] = canUrl;
      console.log('file canvas length:'+canUrl.length);
      /***  展示压缩后的图片
      let newImg = new Image();
      let newCan = $('<canvas style="border: 1px solid"></canvas>');
      newCan.appendTo('#previewPic')
      let newCtx = newCan[0].getContext('2d');
      newImg.src = canUrl;
      newImg.onload = function () {
        newCtx.drawImage(newImg,0,0)
      }
       **/
    };
  }
});

let initUploadData = function () {
  let formdata   = new FormData();
  let serialData = $('form').serializeArray();
  serialData.forEach(function (itm) {
    formdata.append(itm.name, itm.value);
  });
  return formdata;
};

// 提交按钮
$(function () {
  $('#formSubmit').click(function () {
    console.log(formFiles)
    let uploadData = initUploadData();
    $.each(formFiles, function (key, value) {
      uploadData.append(key, value);
    });

    $.ajax({
      url        : '/upload',
      data       : uploadData,
      type       : 'POST',
      // THIS MUST BE DONE FOR FILE UPLOADING
      contentType: false,
      processData: false,
      // ... Other options like success and etc
      beforeSend: function (formDataa, jqForm, options) {
        $('#loading').dialog('open');
        return true;
      },
      success    : function (responseText, statusText) {
        if (responseText) {
          $('#loading').css('color', 'green').html('数据提交成功...');
          setTimeout(function () {
            $('#loading').dialog('close');
          }, 1000)
        }
      },
      error      : function (event, errorText, errorType) { //错误时调用
        $('#loading').css('color', 'red').html('数据提交出错!');
        setTimeout(function () {
          $('#loading').dialog('close');
        }, 2000)
      }
    });

    // $('form').ajaxSubmit({
    //   url         : '/upload',
    //   type        : 'POST',
    //   data        : uploadData,
    //   // contentType: false,
    //   // processData: false,
    //   clearForm   : false,
    //   resetForm   : false,
    //   beforeSubmit: function (formDataa, jqForm, options) {
    //     $('#loading').dialog('open');
    //     return true;
    //   },
    //   success     : function (responseText, statusText) {
    //     if (responseText) {
    //       $('#loading').css('color', 'green').html('数据提交成功...');
    //       setTimeout(function () {
    //         $('#loading').dialog('close');
    //       }, 1000)
    //     }
    //   },
    //   error       : function (event, errorText, errorType) { //错误时调用
    //     $('#loading').css('color', 'red').html('数据提交出错!');
    //     setTimeout(function () {
    //       $('#loading').dialog('close');
    //     }, 2000)
    //   }
    // });

  });

});
