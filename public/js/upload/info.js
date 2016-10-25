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
  {title: '图片1'},
  {title: '图片2'},
  {title: '图片3'},
];

const listInfo = function(){
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
      $('#table_id').DataTable({
        destroy: true,
        lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
        data   : data,
        columns: INFO_THEADER
      })
    },
    error   : function (err) {
      console.log(err)
    }
  })
};

$(function () {
  // 信息以二维数据存放
  // 页面初始化时就直接获得数据
  listInfo();
  $('#table_id tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
  });

});

// ajax 请求数据
$(function () {

  $('#btn_getinfo').button();
  $('#btn_getinfo').click(function () {
    listInfo();
  })
});

// 导航条激活颜色
$(function () {
  $('.navbar a[href=\"' + window.location.pathname + '\"]').addClass('activeNav');
});