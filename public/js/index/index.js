/**
 * Created by heli on 16-8-30.
 */
'use strict';
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

/*****************************************************************
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

/********************************************
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
    }, 300)
  });

  clipboard2.on('success', function (e) {
    console.log(e.text);
    $('#dialog-aftercopy').dialog('open');
    setTimeout(function () {
      $('#dialog-aftercopy').dialog('close');
    }, 300)
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

/*****************************************************************
 *
 * 用户信息按钮
 *
 */
// 保存用户信息
var USER = null;

$(function () {
  // user 按钮
  let bInUser = false;   // 个人信息界面切换标记
  $('#btn-user-img').click(function () {
    if (!bInUser) {  // 当前为商品界面，切换到用户界面
      bInUser = !bInUser;
      // 按钮颜色变化
      $('#user-img-inactive').css('display', 'none');
      $('#user-img-active').css('display', 'block');

      // 显示用户信息界面或登陆界面
      showUserInfo();
    } else {   // 当前为用户界面，切换到商品界面
      bInUser = !bInUser;
      // 按钮颜色变化
      $('#user-img-active').css('display', 'none');
      $('#user-img-inactive').css('display', 'block');

      // 切换到个人信息页面
      $('#list-container').css('display', 'block');
      $('#userInfo').css('display', 'none');
    }

  });

  // 发起ajax请求 获得用户最新信息
  var showUserInfo = function () {
    $.ajax({
      url     : '/u',
      type    : 'GET',
      dataType: 'json',
      success : function (res, status, xhr) {
        if (res.code === 100) {
          window.location.href = '/u/login';
        } else if (res.code === 0) {
          // 切换到个人信息页面
          $('#list-container').css('display', 'none');
          $('#userInfo').css('display', 'block');
        }
      },
      error   : function (err) {

      }
    })
  }
});


/******************************************************
 * 登陆,注册提交按钮
 */
$(function () {
  $('#btn-reg-submit').button();
  $('#btn-login-submit').button();

  $('#btn-login-submit').click(function () {
    $('.login-result').html('');   // 清空错误提示
    $.ajax({
      url     : '/u/login',
      type    : 'POST',
      dataType: 'json',
      data    : $('#form-login').serializeArray(),
      success : function (res, statusText) {
        // 登陆账号密码验证出错
        if (res.code !== 0) {
          console.log(typeof res, res.code, res.msg)
          $('.login-result').html(res.msg).css('color', 'red');
        } else {
          // 验证成功，跳转到个人信息列表(session)
          window.location.href = '/';
        }
      },
      error   : function (err) {
        $('.login-result').html(res.msg).css('color', 'red');
      }
    })
  });

  /* 登陆界面点击注册按钮 */
  $('#loginForm .login-reg').click(function () {
    $('#loginForm').css('display', 'none');
    $('#regForm').css('display', 'block');
  });

  /* 注册界面点击登陆按钮 */
  $('#regForm .reg-login').click(function () {
    $('#loginForm').css('display', 'block');
    $('#regForm').css('display', 'none');
  });

  /* 注册按钮 */
  $('#btn-reg-submit').click(function () {
    $('.reg-result').html('');   // 清空错误提示
    $.ajax({
      url     : '/u/reg',
      type    : 'POST',
      dataType: 'json',
      data    : $('#form-reg').serializeArray(),
      success : function (res, statusText) {
        // 登陆账号密码验证出错
        if (res.code !== 0) {
          $('.reg-result').html(res.msg).css('color', 'red');
        } else {
          // 验证成功，跳转到个人信息列表(session)
          window.location.href = '/';
        }
      },
      error   : function (err) {
        $('.reg-result').html(res.msg).css('color', 'red');
      }
    })
  });

});






