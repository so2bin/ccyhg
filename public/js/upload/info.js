/**
 * Created by heli on 2016/10/25 0025.
 */
const INFO_THEADER = [
  {title: '商品ID'},
  {title: '入库时间'},
  {title: '主类'},
  {title: '子类1'},
  {title: '子类2'},
  {title: 'title'},
  {title: '描述1'},
  {title: '描述2'},
  {title: '券后价格'},
  {title: '优惠价格'},
  {title: '收藏数'},
  {title: '图片1'},
  {title: '图片2'},
  {title: '图片3'},
];

$(function () {
  // 信息以二维数据存放
  // ajax从服务器获取商品数据列表
  var bDelRowActive = false;
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
        $('#table-goods-list').DataTable({
          destroy   : true,
          lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          data      : data,
          columns   : INFO_THEADER
        });
        // 监听多选
        let selNum = 0;    // 标记从0->1还是从1->0
        $('#table-goods-list tbody').on('click', 'tr', function () {
          if (bDelRowActive) {
            $(this).toggleClass('selected');
            // 改变删除数据按钮颜色与提示内容
            if($('.selected').length==1 && selNum==0){
              selNum = 1;
              $('#btn-delRow').toggleClass('btn-info-actived').html('删除所选')
            }else if($('.selected').length==0 && selNum==1){
              selNum = 0;
              $('#btn-delRow').toggleClass('btn-info-actived').html('多选');
            }
          }
        });
      },
      error   : function (err) {
        console.log(err)
      }
    })
  };

  // 页面初始化时就直接获得数据
  listInfo();

  // 获取数据按钮
  $('#btn-getInfo').button();
  $('#btn-delRow').button();
  $('#btn-clearSel').button();

  $('#btn-getInfo').click(function () {
    listInfo();
  });

  $('#btn-delRow').click(function () {
    // 如果关闭删除，则清掉之前的所有多选项
    if (bDelRowActive === true) {
      $('#btn-clearSel').button('disable');
      $('.selected').removeClass('selected');
      // 清除按钮选择状态
      $('#btn-delRow').removeClass('btn-info-actived');
      $('#btn-delRow').html('多选');
    }else{
      $('#btn-delRow').addClass('btn-info-actived').blur();
      $('#btn-clearSel').button('enable');
    }
    bDelRowActive = !bDelRowActive;
  });

  $('#btn-clearSel').click(function () {
    if (bDelRowActive === true) {
      $(this).button('disable');
      $('.selected').removeClass('selected');
      // 清除按钮选择状态
      $('#btn-delRow').removeClass('btn-info-actived');
      $('#btn-delRow').html('多选');
      bDelRowActive = !bDelRowActive;
    }
  });
});


// 包含导航条的页面要包含该js代码： 导航条激活颜色
$(function () {
  $('.navbar a[href=\"' + window.location.pathname + '\"]').addClass('activeNav');
});