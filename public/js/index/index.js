/**
 * Created by heli on 16-8-30.
 */

/**********************************************************************/
/*
 导航栏动画与初始化
 初始时第一个被激活
 */
$(function () {
  var curLink = $('.menu ul li')[0];

  if ('ontouchstart' in window) {
    var click = 'touchstart';
  } else {
    var click = 'click';
  }
  $('div.burger').on(click, function () {
    if (!$(this).hasClass('open')) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  $('div.menu ul li').on(click, function (e) {
    $(curLink).removeClass('active');
    e.preventDefault();
    closeMenu();
    $(this).addClass('active');
    curLink = $(this);
  });
  function openMenu() {
    $('div.burger').addClass('open');
    $('div.y').fadeOut(100);
    $('div.screen').addClass('animate');
    setTimeout(function () {
      $('div.x').addClass('rotate30');
      $('div.z').addClass('rotate150');
      $('.menu').addClass('animate');
      setTimeout(function () {
        $('div.x').addClass('rotate45');
        $('div.z').addClass('rotate135');
      }, 100);
    }, 10);
  }

  function closeMenu() {
    $('div.screen, .menu').removeClass('animate');
    $('div.y').fadeIn(150);
    $('div.burger').removeClass('open');
    $('div.x').removeClass('rotate45').addClass('rotate30');
    $('div.z').removeClass('rotate135').addClass('rotate150');
    setTimeout(function () {
      $('div.x').removeClass('rotate30');
      $('div.z').removeClass('rotate150');
    }, 50);
    setTimeout(function () {
      $('div.x, div.z').removeClass('collapse');
    }, 70);
  }
});

/**********************************************************************/
/*
 商品相关js
 */
$(function () {
  // 收藏按钮切换与事件调用
  $('.btn_good_collect_active').click(function () {
    $(this).fadeOut(200, function () {

    });
    $(this).parent().find('.btn_good_collect_inactive').fadeIn(1000, function () {

    });
  });
  $('.btn_good_collect_inactive').click(function () {
    $(this).fadeOut(500, function () {

    });
    $(this).parent().find('.btn_good_collect_active').fadeIn(500, function () {

    });
  })
});

/*
 点击购买步骤按钮，完成复制过程
 */
$(function () {
  // Clipboard.js 剪贴板插件
  let clipboard1 = new Clipboard('.btn_buy1');
  let clipboard2 = new Clipboard('.btn_buy2');

  // 复制完成提示框,跳转对话框
  $('#dialog-aftercopy').dialog({
    modal        : false,
    autoOpen     : false,
    closeOnEscape: false, //按下 esc 无效
    resizable    : false,
    draggable    : false,
    width        : 60,
    height       : 30,
    minWidth     : 10,
    minHeight    : 0
  }).parent().parent().find('.ui-widget-header').hide();

  clipboard1.on('success', function (e) {
    console.log(e.text);
    $('#dialog-aftercopy').dialog('open');
    setTimeout(function () {
      $('#dialog-aftercopy').dialog('close');
    },300)
  });

  clipboard2.on('success', function (e) {
    console.log(e.text);
    $('#dialog-aftercopy').dialog('open');
    setTimeout(function () {
      $('#dialog-aftercopy').dialog('close');
    },300)
  });

  // 按钮颜色切换
  $('.btn_buy1').on({
    'mousedown': function () {
      $(this).removeClass('buy-up');
      $(this).addClass('buy-down');
    },
    'mouseup'  : function () {
      $(this).removeClass('buy-down');
      $(this).addClass('buy-up');
    }
  });

  $('.btn_buy2').on({
    'mousedown': function () {
      $(this).removeClass('buy-up');
      $(this).addClass('buy-down');
    },
    'mouseup'  : function () {
      $(this).removeClass('buy-down');
      $(this).addClass('buy-up');
    }
  });

});



