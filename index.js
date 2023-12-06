const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {}
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(join('public', 'index.html'));
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (userName) => {
    users[socket.id] = userName;
    socket.broadcast.emit('user-joined', userName);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(9000, () => {
  console.log('server running at http://localhost:9000');
});