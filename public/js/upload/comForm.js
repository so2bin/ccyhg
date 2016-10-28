/**
 * Created by duoyi on 16-10-28.
 */
/*******************************************
 *   define a plugin that is used for completing the
 *   common form functions in pages of upload and info-editor dialog
 */
'use strict';
;(function ($) {
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
          $('#mainKey').selectmenu('refresh');
          $('#subKey1').selectmenu('refresh');
        }
      })
    }
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
    if (img.src.length > dstSize) {
      cpRatio = img.src.length / dstSize;
    }
    return cpRatio;
  }

  // init upload data
  // let fileList  = null;
  // let formFiles = {};

  // 清空所有图片的按钮
  // $('#btn-thumb-delete').button();
  // $('#btn-thumb-delete').click(function () {
  //   //清空选择的文件
  //   let files = $('#file-input');
  //   files.after(files.clone().val(''));
  //   files.remove();
  //   //删除缩略
  //   $('#previewPic').children($('.thumb-warpper')).remove();
  // });

  // 选择图片 形成缩略图
  $.hl_GetUpFiles = function (formFiles) {
    $('#file-input').on('change', function () {
      formFiles['file0'] = null, formFiles['file1'] = null, formFiles['file2'] = null;
      let fileList = this.files;        // FileList {0: File, 1: File, length: 2}
      for (var idx = 0; idx < fileList.length; ++idx) {
        let file   = fileList[idx];
        let reader = new FileReader();
        let img    = new Image();
        // 读取原图为data url
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          img.src = e.target.result;
          console.log('file original length:' + e.target.result.length)
        };
        // canvas展示缩略图
        let thumImg      = $(
          '<div class="thumb-warpper">' +
          '  <div id="thumb-delete"></div>' +
          '  <canvas class="thumbnail"></canvas>' +   // 略缩图区
          '</div>'
        );
        thumImg.appendTo('#previewPic');
        // $canvas.addClass('thumbnail');
        let cnv     = thumImg.find('canvas').get(0);
        let context = cnv.getContext('2d');

        // img获得数据, 生成压缩图，画缩略图
        let flag = idx;
        img.onload = function () {
          let ratio = compressPic(img);
          context.drawImage(img, 0, 0, 300, 150);
          let canUrl                   = cnv.toDataURL("image/jpeg", 0.96);
          formFiles['file' + flag] = canUrl;
          console.log('file canvas length:' + canUrl.length);
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
  };

  // 将内容填充到编辑器中，方便修改
  $.hl_FillEditor = function (obj) {
    $('#goodsId').val(obj[0]);
    $('#ftime').val(obj[1]);
    $('#mainKey').val(obj[2]);
    $('#subKey1').val(obj[3]);
    $('#subKey2').val(obj[4]);
    $('#goodstitle textarea').html(obj[5]);
    $('#step1 textarea').html(obj[6]);
    $('#step2 textarea').html(obj[7]);
    $('#realPrice input').val(obj[8]);
    $('#coupon input').val(obj[9]);

    // 刷新jquery-ui selectmenu
    $('#mainKey').selectmenu('refresh');
    $('#subKey1').selectmenu('refresh');
    $('#subKey2').selectmenu('refresh');
  };

})(jQuery);

