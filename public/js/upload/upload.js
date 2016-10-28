/**
 * Created by Administrator on 2016/10/2 0002.
 */
'use strict';

$(function () {
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

// $(function () {
//   // 初始化插件
//   let pics = $("#picUpload").zyUpload({
//     width     : '400px',                 // 宽度
//     height    : "280px",                 // 宽度
//     itemWidth : "120px",                 // 文件项的宽度
//     itemHeight: "100px",                 // 文件项的高度
//     url       : "/upload",  // 上传文件的路径
//     multiple  : true,                    // 是否可以多个文件上传
//     dragDrop  : true,                    // 是否可以拖动上传文件
//     del       : true,                    // 是否可以删除文件
//     finishDel : false,  				  // 是否在上传文件完成后删除预览
//   });
// });

let initUploadData = function () {
  let formdata   = new FormData();
  let serialData = $('form').serializeArray();
  serialData.forEach(function (itm) {
    formdata.append(itm.name, itm.value);
  });
  return formdata;
};

const formFiles = {};
$.hl_GetUpFiles(formFiles);

// 提交按钮
$(function () {
  $('#formSubmit').click(function () {
    let uploadData = initUploadData();
    $.each(formFiles, function (key, value) {
      if(value!==null){
        uploadData.append(key, value);
      }
    });

    $.ajax({
      url        : '/upload?type=insert',
      data       : uploadData,
      type       : 'POST',
      dataType   : 'json',
      // THIS MUST BE DONE FOR FILE UPLOADING
      contentType: false,
      processData: false,
      // ... Other options like success and etc
      beforeSend : function (formDataa, jqForm, options) {
        $('#loading').dialog('open');
        return true;
      },
      success    : function (res, status) {
        console.log(res);
        if (res) {
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
  });
});
