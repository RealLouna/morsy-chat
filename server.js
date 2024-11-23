const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Héberger les fichiers statiques
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté');

  // Recevoir et émettre un message
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

server.listen(4000, () => {
  console.log('Serveur en cours d\'exécution sur le port 4000');
});

