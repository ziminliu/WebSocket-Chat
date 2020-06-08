/*
 * @Author: 刘子民
 * @Date: 2020-06-07 21:19:05
 * @LastEditTime: 2020-06-08 08:40:24
 */

/* 
  1. 连接socket 服务
*/

var socket = io('http://localhost:3000');

var username = '';
var avatar = '';
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
  username = data.username;
  avatar = data.avatar;
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

  scrollIntoView();
});

// 监听用户列表的消息
socket.on('userList', data => {
  // 吧userList 中的数据 动态渲染到左侧菜单
  $('.user-list ul').html('');
  data.forEach(item => {
    $('.user-list ul').append(`
    <li class="user">
      <div class="avatar"><img src="${item.avatar}" alt=""></div>
      <div class="name">${item.username}</div>
    </li>
    `);
  });
  $('#userCount').text(data.length);
});

// 监听用户离开的系统消息
socket.on('delUser', data => {
  // 添加一条系统消息
  $('.box-bd').append(`
  <div class="system">
    <p class="message_system">
      <span class="content">${data.username}离开了群聊</span>
    </p>
  </div>
  `);

  scrollIntoView();
});

// 聊天功能
$('.btn-send').on('click', () => {
  // 获取聊天的内容
  var content = $('#content').text().trim();
  // console.log($('#content').text());
  $('#content').text('');
  if (!content) return alert('请输入内容');

  // 拿到内容发送给服务器
  socket.emit('sendMessage', {
    msg: content,
    username: username,
    avatar: avatar,
  });
});

// 监听聊天的消息
socket.on('receiveMessage', data => {
  console.log(data);
  // 显示接收的消息
  console.log(username);
  if (data.username === username) {
    // console.log('my message');
    // 自己的消息
    $('.box-bd').append(`
    <div class="message-box">
      <div class="my message">
        <img class="avatar" src="${data.avatar}" alt="" />
        <div class="content">
          <div class="bubble">
            <div class="bubble_cont">${data.msg}</div>
          </div>
        </div>
      </div>
    </div>
    `);
  } else {
    // 别人的消息
    console.log('other message');
    $('.box-bd').append(`
    <div class="message-box">
    <div class="other message">
      <img class="avatar" src="${data.avatar}" alt="" />
      <div class="content">
        <div class="nickname">${data.username}</div>
        <div class="bubble">
          <div class="bubble_cont">${data.msg}</div>
        </div>
      </div>
    </div>
    </div>
    `);
  }

  scrollIntoView();
});

// 当前元素的底部滚动到可视区
function scrollIntoView() {
  $('.box-bd').children(':last').get(0).scrollIntoView(false);
}

// 发送图片
$('#file').on('change', function () {
  var file = this.files[0];

  // 把这个文件发送到服务器，借助于H5 新增的fileReader
  var fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = function () {
    // console.log(fr.result)
    socket.emit('sendImage', {
      username: username,
      avatar: avatar,
      img: fr.result,
    });
  };
});

// 监听图片聊天信息
// 监听聊天的消息
socket.on('receiveImage', data => {
  // 显示接收的消息
  if (data.username === username) {
    // console.log('my message');
    // 自己的消息
    $('.box-bd').append(`
    <div class="message-box">
      <div class="my message">
        <img class="avatar" src="${data.avatar}" alt="" />
        <div class="content">
          <div class="bubble">
            <div class="bubble_cont">
              <img src="${data.img}" />
            </div>
          </div>
        </div>
      </div>
    </div>
    `);
  } else {
    // 别人的消息
    console.log('other message');
    $('.box-bd').append(`
    <div class="message-box">
    <div class="other message">
      <img class="avatar" src="${data.avatar}" alt="" />
      <div class="content">
        <div class="nickname">${data.username}</div>
        <div class="bubble">
          <div class="bubble_cont">
            <img src="${data.img}" />
          </div>
        </div>
      </div>
    </div>
    </div>
    `);
  }
  // 等待图片加载完成
  $('.box-bd img:last').on('load', function () {
    scrollIntoView();
  });
});
