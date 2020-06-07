/*
 * @Author: 刘子民
 * @Date: 2020-06-07 21:04:40
 * @LastEditTime: 2020-06-07 21:40:21
 */ 
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000,()=>{
  console.log('server running at port 3000')
});
// WARNING: app.listen(80) will NOT work here!

// express 处理静态资源
// 把public 目录设置为静态资源目录
app.use(require('express').static('public'))

app.get('/', (req, res) => {
  res.redirect('/index.html')
  // res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // console.log('新用户连接了')
  socket.on('login',data=>{
    // 判断 如果data 在users 中存在 就说明用户
    console.log(data)
  })
});