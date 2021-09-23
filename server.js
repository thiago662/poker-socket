var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});
var port = process.env.PORT || 3000;

let users = [];

io.on('connection', function(socket) {
    socket.on('generateId', data => {
        user = {
            id: socket.id,
            name: null,
            value: null,
            selected: false
        }

        users.push(user);

        socket.emit('myId', user);
        socket.emit('room', users);
        socket.broadcast.emit('newUser', user);
    });

    socket.on('setName', data => {
        objIndex = users.findIndex((obj => obj.id == data.id));

        users[objIndex].name = data.name;

        socket.emit('myName', data);
        socket.broadcast.emit('userName', data);
    });
    
    socket.on('checkUserExist', data => {
        objIndex = users.findIndex((obj => obj.id == data));

        socket.emit('myUser', users[objIndex]);
        if (users[objIndex] != null) {
            socket.emit('room', users);
        }
    });

    socket.on('delete', data => {
        users = users.filter(function(item) {
            return item.id != data;
        });

        socket.emit('myDelete', data);
        socket.broadcast.emit('userDeleted', data);
    });

    socket.on('setValue', data => {   
        objIndex = users.findIndex((obj => obj.id == data.id));

        users[objIndex].value = data.value;
        users[objIndex].selected = true;

        socket.emit('myUpdate', users[objIndex]);
        socket.broadcast.emit('userUpdated', data.id);
    });

    socket.on('show', data => {
        socket.emit('showMe', users);
        socket.broadcast.emit('showAll', users);
    });

    socket.on('reset', data => {
        for (const user of users) {
            user.value = null;
            user.selected = false;
        }

        socket.emit('resetMe', users);
        socket.broadcast.emit('resetAll', users);
    });

    socket.on('disconnect', function () {

        users = users.filter(function(item) {
            return item.id != socket.id;
        });

        socket.broadcast.emit('userDeleted', socket.id);
    });
});

server.listen(port, () => {
})
