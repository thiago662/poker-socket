'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

let users = [];

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: "*"
  }
});;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('generateId', data => {
    let user = {
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
    let objIndex = users.findIndex((obj => obj.id == data.id));

    users[objIndex].name = data.name;

    socket.emit('myName', data);
    socket.broadcast.emit('userName', data);
  });
  
  socket.on('checkUserExist', data => {
    let objIndex = users.findIndex((obj => obj.id == data));

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
    let objIndex = users.findIndex((obj => obj.id == data.id));

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
    console.log(`Client disconnected: ${socket.id}`);

    users = users.filter(function(item) {
      return item.id != socket.id;
    });

    socket.broadcast.emit('userDeleted', socket.id);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
