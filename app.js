/*
 * @Author: 刘子民
 * @Date: 2020-06-07 21:04:40
 * @LastEditTime: 2020-06-08 00:01:07
 */

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var users = [];
server.listen(3000, () => {
  console.log('server running at port 3000');
});
// WARNING: app.listen(80) will NOT work here!

// express 处理静态资源
// 把public 目录设置为静态资源目录
app.use(require('express').static('public'));

app.get('/', (req, res) => {
  res.redirect('/index.html');
  // res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  // console.log('新用户连接了')
  socket.on('login', data => {
    // 判断 如果data 在users 中存在 就说明用户已经登录，此时不能登录，
    // 如果不在 则可以登录
    let user = users.find(item => item.username === data.username);
    if (user) {
      // 用户存在，登录失败
      socket.emit('loginError', { message: '登录失败' });
      console.log('登录失败');
    } else {
      // 用户不存在，可以登录
      users.push(data);
      socket.emit('loginSuccess', data);
      // console.log('登录成功');

      // 告诉所有的用户，有用户加入到了聊天室，广播消息 无需封装 socketio 内置

      // socker.emit :告诉当前用户
      // io.emit : 告诉所有的用户
      io.emit('addUser', data);

      // 告诉所有的用户，目前聊天室的人数
      io.emit('userList', users);
    }

    // 记录当前连接对象的属性
    socket.username = data.username;
    socket.avatar = data.avatar;
  });

  // 用户断开连接功能
  // 监听用户断开连接
  socket.on('disconnect', () => {
    let idx = users.findIndex(item => item.username === socket.username);
    // 删除掉断开连接的这个人
    users.splice(idx, 1);
    // 1. 告诉所有人，有人离开群聊
    io.emit('delUser', {
      username: socket.username,
      avatar: socket.avatar,
    });
    
    // 2. 告诉所有人，userList 发生更新
    io.emit('userList', users);
  });

  socket.on('sendMessage',data=>{
    console.log(data)
    io.emit('receiveMessage',data)
  })
});

