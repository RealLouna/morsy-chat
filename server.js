const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Héberger les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté');

  // Recevoir et émettre un message
  socket.on('sendMessage', (message) => {
    console.log('Message reçu :', message);
    io.emit('receiveMessage', message);
  });

  // Recevoir et émettre une image
  socket.on('sendImage', (message) => {
    console.log('Image reçue :', message);
    io.emit('receiveImage', message);
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
