/**
 * Created by heli on 2016/10/25 0025.
 */
$(function () {
    //信息以二维数据存放
    var dataSet = [
        [1,2,3,4,5,6,7,8,9,10,11,12]
    ];
    $('#table_id').DataTable({
        lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
        data: dataSet,
        columns:[
            {title: '商品ID'},
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
        ]
    });
    $('#table_id tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
});