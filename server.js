var express = require('express');
var socket = require('socket.io');

var app =  express();
var server = require('http').createServer(app);
var  io = socket.listen(server);
var users = [];//保存在线用户
app.use('/',express.static(__dirname+"/www"));
server.listen(3000);

//socket
io.on('connection',function (socket) {

    socket.on('message',function (msg) {
        io.emit('message',msg);
    });

    //这里的socket参数是正在链接在服务器的
    socket.on('disconnect',function () {
        users.splice(socket.userIndex,1);
        io.emit('system',socket.nickname,users.length,'logout');
    });

    socket.on('login',function (name) {

        if (users.indexOf(name) > -1){
            socket.emit('nickExisted');
        }else {
            socket.userIndex = users.length;//从聊天室退出删除数组中其所在位置
            socket.nickname = name;
            users.push(name);
            console.log(users);
            socket.emit('loginSuccess');//只向链接的客户端发送
            io.emit('system',name,users.length,'login'); //io.emit向所有在线用户发送
        }
    });

    socket.on('postMsg',function (msg,color) {
        io.emit('newMsg',socket.nickname,msg,color);
    });
});