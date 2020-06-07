/*
 * @Author: 刘子民
 * @Date: 2020-06-07 21:19:05
 * @LastEditTime: 2020-06-07 22:22:21
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

//监听登录失败的请求
socket.on('loginError', data => {
  alert(data.message);
});

// 监听登录成功的请求
socket.on('loginSuccess', data => {
  // alert(data.username);
  // 显示聊天窗口
  // 隐藏登录窗口
  $('.login_box').fadeOut();
  $('.container').fadeIn();

  // 设置个人信息
  $('.avatar_url').attr('src', data.avatar);
  $('.user-list .username').text(data.username);
});

// 监听添加用户的消息
socket.on('addUser', data => {
  // 添加一条系统消息
  $('.box-bd').append(`
  <div class="system">
    <p class="message_system">
      <span class="content">${data.username}加入了群聊</span>
    </p>
  </div>
  `);
});
