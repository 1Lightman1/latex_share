const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedText = "";

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  socket.emit('text-update', sharedText);

  socket.on('text-update', (newText) => {
    sharedText = newText;
    socket.broadcast.emit('text-update', newText);
  });
});

server.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
