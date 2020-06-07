/*
 * @Author: 刘子民
 * @Date: 2020-06-07 21:19:05
 * @LastEditTime: 2020-06-07 21:38:32
 */

/* 
  1. 连接socket 服务
*/

var socket = io('http://localhost:3000');

/* 
  2 登录功能
*/
$('#login_avatar li').on('click', function () {
  $(this).addClass('now').siblings().removeClass('now');
});

// 点击按钮，登录
$('#loginBtn').on('click', function () {
  // 获取用户名
  var username = $('#username').val().trim();
  if (!username) {
    alert('用户名不能为空');
    return;
  }
  // 获取用户头像
  var avatar = $('#login_avatar li.now img').attr('src');
  // console.log(username, avatar);

  // 告诉socket io 服务 登录
  socket.emit('login', {
    username: username,
    avatar: avatar,
  });
});
