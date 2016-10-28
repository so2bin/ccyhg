/**
 * Created by heli on 2016/10/25 0025.
 */
'use strict';
const INFO_THEADER = [
  {title: '商品ID', width: '36px'},
  {title: '入库时间', width: '60px'},
  {title: '主类', width: '30px'},
  {title: '子类1', width: '30px'},
  {title: '子类2', width: '30px'},
  {title: 'title', width: '100px'},
  {title: '描述1', width: '200px'},
  {title: '描述2', width: '300px'},
  {title: '券后价格', width: '20px'},
  {title: '优惠价格', width: '20px'},
  {title: '收藏数', width: '20px'},
  {title: '图片1', width: '40px'},
  {title: '图片2', width: '40px'},
  {title: '图片3', width: '40px'},
];

const columnDefs = [
  {'width': '20px', "targets": 11}
];
let table_goods   = null;  // 商品表格对象

/**************************************************
  控件的初始化
  ajax从服务器获取商品数据列表
*/
$(function () {
  // 信息以二维数据存放
  let bDelRowActive = false; // 标记多选按钮是否激活
  let selNum        = 0;    // 标记当前选择行的数量
  const listInfo    = function () {
    $.ajax({
      url     : '/info/listgoods',
      dataType: 'json',
      type    : 'GET',
      success : function (res, status, xhr) {
        let data = [];
        res.msg.forEach(function (itm) {
          let row = [];
          for (let idx in itm) {
            row.push(itm[idx]);
          }
          data.push(row);
        });
        table_goods = $('#table-goods-list').DataTable({
          autoWidth : false,
          columnDefs: columnDefs,
          destroy   : true,
          lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          data      : data,
          columns   : INFO_THEADER
        });
        // 设置图片列的宽度
        $('#table-goods-list').css('table-layout', 'fixed');
        $('#table-goods-list tbody tr td/*:nth-child(12)*/').css({
          'word-wrap': 'break-word'
        });

        // 监听多选
        $('#table-goods-list tbody').on('click', 'tr', function () {
          if (bDelRowActive) {
            $(this).toggleClass('selected');
            // 改变删除数据提示内容
            if ($('.selected').length == 1 && selNum == 0) {
              selNum = 1;
              $('#btn-delRow').html('删除所选')
            } else if ($('.selected').length == 0 && selNum == 1) {
              selNum = 0;
              $('#btn-delRow').html('多选');
            }
            // 编辑按钮
            if ($('.selected').length !== 1) {
              $('#btn-edit').button('disable');
            } else {
              $('#btn-edit').button('enable');
            }
          }
        });
      },
      error   : function (err) {
        console.log(err)
      }
    })
  };

  // 清除所有选择
  let clearSelection = function () {
    if (bDelRowActive === true) {
      $('#btn-clearSel').button('disable');
      $('.selected').removeClass('selected');
      // 清除按钮选择状态
      $('#btn-delRow').removeClass('btn-info-actived');
      $('#btn-delRow').html('多选');
      $('#btn-edit').button('disable');
      bDelRowActive = !bDelRowActive;
      selNum        = 0;
    }
  };

  // 页面初始化时就直接获得数据
  listInfo();

  // 获取数据按钮
  $('#btn-getInfo').button();
  $('#btn-delRow').button();
  $('#btn-clearSel').button();
  $('#btn-edit').button();

  $('#btn-getInfo').click(function () {
    // 先清除所有选择
    clearSelection();
    listInfo();
  }).blur();

  $('#btn-delRow').click(function () {
    // 如果关闭删除，则清掉之前的所有多选项
    if (bDelRowActive === true) {
      // 如果当前已经选择了项,则进行删除处理
      if (selNum === 1) {
        let selRows = table_goods.rows('.selected');
        selRows.data().map(row=> {
          $.ajax({
            url    : '/info/listgoods?id=' + row[0],
            type   : 'DELETE',
            // 成功后才从表中删除行
            success: function (responseText, statusText) {
              if (responseText) {
                $('#loading').css('color', 'green').html('删除成功').dialog('open');
                setTimeout(function () {
                  $('#loading').dialog('close');
                }, 1000);
                selRows.remove().draw(false);
                $('#btn-edit').button('disable');
              }
            },
            // 失败不从表中删除行
            error  : function (event, errorText, errorType) { //错误时调用
              $('#loading').css('color', 'red').html('删除过程出错!').dialog('open');
              setTimeout(function () {
                $('#loading').dialog('close');
              }, 1000)
            }
          })
        });
      } else {  // 否则仅仅关闭多选
        clearSelection();
      }
    } else {
      $('#btn-delRow').addClass('btn-info-actived').blur();
      $('#btn-clearSel').button('enable');
      bDelRowActive = !bDelRowActive;
    }
  });

  $('#btn-clearSel').click(function () {
    if (bDelRowActive === true) {
      clearSelection();
    }
  });

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

// 编辑器按钮
$(function () {
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

  // 点击编辑按钮， 将所有内容写到编辑器里面
  $('#btn-edit').click(function () {
    $('#tbl-editor').show();
    $.hl_FillEditor(table_goods.row('.selected').data());
  });

  $('#cancelSubmit').click(function () {
    $('#tbl-editor').hide();
  });

  // 更新按钮
  $(function () {
    $('#formSubmit').click(function () {
      let uploadData = initUploadData();
      $.each(formFiles, function (key, value) {
        uploadData.append(key, value);
      });
      $.ajax({
        url        : '/upload?type=update',
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
});

// 包含导航条的页面要包含该js代码： 导航条激活颜色
$(function () {
  $('.navbar a[href=\"' + window.location.pathname + '\"]').addClass('activeNav');
});