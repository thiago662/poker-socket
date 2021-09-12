var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});

let users = [];

io.on('connection', function(socket) {
    console.log('A user connected: ' + socket.id);
    
    socket.on('setUser', data => {
        user = {
            id: socket.id,
            name: data.name,
            value: null,
            selected: false
        }

        users.push(user);

        socket.emit('myUser', user);
        socket.broadcast.emit('newUser', user);
    });

    socket.on('delete', data => {
        users = users.filter(function(item) {
            return item.id != data;
        });

        socket.broadcast.emit('newUser', user);
    });
});

server.listen(3000, () => {
    console.log('socket.io server is listing on port 3000');
})
