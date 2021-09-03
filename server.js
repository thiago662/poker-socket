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
            name: data.name
        }

        users.push(user);

        socket.emit('myRoom', users);
        socket.broadcast.emit('newUser', user);
    });

    // socket.on('createRoom', data => {
    //     users.forEach(element => {
    //         if (element.id == data.id) {
    //             element.name = data.name;
    //         }
    //     });
    //     socket.broadcast.emit('receivedMessage', data);
    // });
});

server.listen(3000, () => {
    console.log('socket.io server is listing on port 3000');
})
