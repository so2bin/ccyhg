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
  // $('div.menu ul li').on(click, function (e) {
  //   $('div.menu ul li.active').removeClass('active');
  //   e.preventDefault();
  //   closeMenu();
  //   $(this).addClass('active');
  // });
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

  /***************************
   * 当页面刷新加载时, 获得当前页面筛选条件, 并激活筛选条件DOM颜色
   */
  console.log(window.location.href)

  /********************************************************
   *  侧边栏导航按钮 点击后展开子类
   */
  // 一级导航栏点击事件由一级ul代理
  $('div.menu>ul').on('click', '.mainKey', function (e) {
    e.stopPropagation();
    $('div.menu ul li.active').removeClass('active');
    $(this).addClass('active');
    // 如果当前li下面还有ul,即子导航栏,则打开导航栏, 否则打开链接
    if ($(this).has('ul').length) {
      $(this).children('ul').toggle(100);
    } else {
      closeMenu();
      window.location.href = '/?mainKey=' + $(this).text();
    }
  });

  // 二级导航栏点击事件由二级ul代理
  $('.mainKey>ul').on('click', '.subKey1', function (e) {
    e.stopPropagation();
    var subKey1 = $(this).text();
    // 获得主类的选项值
    var mainKey = $(e.delegateTarget).prev().text();
    $(e.delegateTarget).children('.menu-subkey-selected')
    .toggleClass('menu-subkey-selected');
    $(this).toggleClass('menu-subkey-selected');
    // 刷新页面
    window.location.href = '/?mainKey=' + mainKey + '&subKey1=' + subKey1;
  });

});

/*****************************************************************
 /*
 商品收藏js
 */

$(function () {
  // 取消收藏按钮切换与事件调用
  $('.btn_good_collect_active').click(function () {
    var that = $(this);
    var id   = $(this).parent('.good-caption').children('.id').html();
    // 往服务器发送收藏数据
    $.ajax({
      url     : '/uncollect?id=' + id,
      type    : 'GET',
      dataType: 'json',
      success : function (res) {
        if (res.code == 0) {
          // 成功
          that.fadeOut(200, function () {
          });
          that.parent().find('.btn_good_collect_inactive').fadeIn(0, function () {
          });
        } else if (res.code == 100) {
          // 没有登陆
          $('#dialog-center').show();
        } else {
          $('#dialog-aftercopy').css('color', 'red').html('取消失败').dialog('open');
          setTimeout(function () {
            $('#dialog-aftercopy').dialog('close');
          }, 1000);
        }
      },
      error   : function () {

      }
    });

  });

  // 收藏
  $('.btn_good_collect_inactive').click(function () {
    var that = $(this);
    var id   = $(this).parent('.good-caption').children('.id').html();
    $.ajax({
      url     : '/collect?id=' + id,
      type    : 'GET',
      dataType: 'json',
      success : function (res) {
        if (res.code == 0) {
          // 成功
          that.fadeOut(0, function () {
          });
          that.parent().find('.btn_good_collect_active').fadeIn(300, function () {
          });
        } else if (res.code == 100) {
          // 没有登陆
          $('#dialog-center').show();
        }
        else {
          $('#dialog-aftercopy').css('color', 'red').html('收藏失败').dialog('open');
          setTimeout(function () {
            $('#dialog-aftercopy').dialog('close');
          }, 1000)
        }
      },
      error   : function () {

      }
    });

  });

});

// 提示登陆对话框
$(function () {
  $('#dialog-collect-login-tips .dialog-collect-cancel').button();
  $('#dialog-collect-login-tips .dialog-collect-ok').button();

  $('#dialog-center .dialog-collect-cancel').click(function () {
    $('#dialog-center').hide();
  });
  $('#dialog-center .dialog-collect-ok').click(function () {
    $('#dialog-center').hide();
    // 显示登陆界面
    window.location.href = '/u/login';
  });
});

/********************************************
 点击购买步骤按钮，完成复制过程
 */
$(function () {
  // Clipboard.js 剪贴板插件
  var clipboard1 = new Clipboard('.btn_buy1');
  var clipboard2 = new Clipboard('.btn_buy2');

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
    $('#dialog-aftercopy').css('color', 'black').html('复制成功').dialog('open');
    setTimeout(function () {
      $('#dialog-aftercopy').dialog('close');
    }, 300)
  });

  clipboard2.on('success', function (e) {
    console.log(e.text);
    $('#dialog-aftercopy').css('color', 'black').html('复制成功').dialog('open');
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
 * 用户信息, 登出按钮
 *
 */
// 保存用户信息
var USER = null;

$(function () {
  // user 按钮
  var bInUser = false;   // 个人信息界面切换标记
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
      url        : '/u',
      type       : 'GET',
      dataType   : 'json',
      contentType: 'charset=utf-8',
      success    : function (res, status, xhr) {
        if (res.code != 0) {
          bInUser = false;    // 刷新后无效,需要修改  // TODO
          window.location.href = '/u/login';
        } else if (res.code === 0) {
          // 切换到个人信息页面
          $('#list-container').css('display', 'none');
          $('#userInfo').css('display', 'block');

          // 初始化个人信息界面
          initUserInfoWithRes(res.msg);
        }
      },
      error      : function (err) {
        $('#user-res-tips').css('display', 'block').html('Sorry,服务器出错啦!');
        bInUser = true;
        setTimeout(function () {
          window.location.href = '/';
        }, 500);
      }
    })
  };

  var initUserInfoWithRes = function (user) {
    $('#userInfo .user-id .value').html(user.id);
    $('#userInfo .user-name .value').html(user.username);
    $('#userInfo .user-sex .value').html(user.sex);

    // 清空原先的收藏数据
    $('#userInfo .user-collect-list').html("");
    // 显新的收藏物品
    var collectgood = [
      '  <div class="good-info thumbnail">',
      '    <img class="good-img img-rounded" src="good_pic1">',
      '    <div class="good-caption">',
      '      <div class="id" style="display: none">good_id</div>',
      '      <div class="good-title">good_title</div>',
      '      <div class="good-price">',
      '        优惠后:&nbsp;',
      '        <span>good_realprice</span>',
      '      </div>',
      '      <div class="good-coupon">',
      '        优惠劵:&nbsp;',
      '        <span>good_coupon</span>',
      '      </div>',
      '      <div class="buy">',
      '        <div class="btn_buy1 buy-up" data-clipboard-text="good_step1">去领卷</div>',
      '      </div>',
      '      <div class="good-collect-num">',
      '        收藏数:&nbsp;',
      '        <span>good_collect</span>',
      '      </div>',
      '      <div class="btn_good_collect_active_user heart-active"></div>',
      '      </div>',
      '  </div>'
    ];
    // 上面的收藏按钮重新定义了一个lass, 勇于点击,应为目前这个界面与商品界面完全一样, 如果与商品界面公用
    // 点击事件,则不好区分时那个界面的按钮点击, 用上面的bInUser变量做标示可能日后会有麻烦;
    collectgood = collectgood.join("");
    $.each(user.collectgoods, function (idx, good) {
      var regGood = collectgood;
      regGood     = regGood.replace(/good_id/, good.id);
      regGood     = regGood.replace(/good_pic1/, good.pic1);
      regGood     = regGood.replace(/good_title/, good.title);
      regGood     = regGood.replace(/good_realprice/, good.realprice);
      regGood     = regGood.replace(/good_coupon/, good.coupon);
      regGood     = regGood.replace(/good_collect/, good.collect);
      var curGood = $(regGood);
      curGood.appendTo($('#userInfo .user-collect-list'));
      // 监听事件
      $(curGood.find('.btn_good_collect_active_user').get(0)).click(function () {
        var that = $(this).parent('.good-caption').children('.id');
        var id   = that.html();
        // 往服务器发送收藏数据
        $.ajax({
          url     : '/uncollect?id=' + id,
          type    : 'GET',
          dataType: 'json',
          success : function (res) {
            if (res.code == 0) {
              // 成功 从当前界面删除该元素
              curGood.remove();
              // 在商品界面中取消收藏
              var idDiv = $('#list-container .goods-lists .id:contains(' + id + ')').parent('.good-caption');
              idDiv.children('.btn_good_collect_active').css('display', 'none');
              idDiv.children('.btn_good_collect_inactive').css('display', 'block');
            } else if (res.code == 100) {
              // 没有登陆
              $('#dialog-center').show();
            } else {
              $('#dialog-aftercopy').css('color', 'red').html('取消失败').dialog('open');
              setTimeout(function () {
                $('#dialog-aftercopy').dialog('close');
              }, 1000);
            }
          },
          error   : function () {

          }
        });

      });
    });
  };

  //登出按钮初始化
  $('#user-header .user-login-out').button();
  $('#user-header .user-login-out').click(function () {
    $.ajax({
      url        : '/u/loginout',
      type       : 'GET',
      dataType   : 'json',
      contentType: 'charset=utf-8',
      success    : function () {
        bInUser = !bInUser;
        window.location.href = '/';
      },
      error      : function (err) {
        $('#user-res-tips').css('display', 'block').html('Sorry,服务器出错啦!');
        setTimeout(function () {
          window.location.href = '/';
        }, 500);
      }
    })
  })

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






