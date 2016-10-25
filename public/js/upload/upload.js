/**
 * Created by Administrator on 2016/10/2 0002.
 */
'use strict';
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

// 初始化图片上传插件
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

/**********************************************/
// 点击上传数据
// init upload data
let initUploadData = function () {
  let formdata   = new FormData();
  let serialData = $('form').serializeArray();
  let serialJson = {};
  serialData.forEach(function (itm) {
    serialJson[itm.name] = itm.value;
  });
  $.extend(formdata, serialJson);
  $.extend(formdata, {
    pics: ZYFILE.uploadFile
  });
  console.log(formdata);
  return formdata;
};

$('#file-input').on('change',function () {
  let fileList = this.files;

  $.each(fileList,function (idx,file) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      console.log('-----',e.target.result.byteLength);
    };
  });
  console.log(fileList)
});

$(function () {
  $('#formSubmit').click(function () {
    let uploadData = initUploadData();
    $('form').ajaxSubmit({
      url         : '/upload',
      type        : 'POST',
      data        : uploadData,
      clearForm   : false,
      resetForm   : false,
      beforeSubmit: function (formDataa, jqForm, options) {
        $('#loading').dialog('open');
        return true;
      },
      success     : function (responseText, statusText) {
        if (responseText) {
          $('#loading').css('color', 'green').html('数据提交成功...');
          setTimeout(function () {
            $('#loading').dialog('close');
          }, 1000)
        }
      },
      error       : function (event, errorText, errorType) { //错误时调用
        $('#loading').css('color', 'red').html('数据提交出错!');
        setTimeout(function () {
          $('#loading').dialog('close');
        }, 2000)
      }
    });

  });

});
