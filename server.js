const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messagesFile = 'messages.json';

// Lire les messages depuis le fichier JSON
function readMessages() {
  if (fs.existsSync(messagesFile)) {
    return JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
  } else {
    return [];
  }
}

// Sauvegarder les messages dans le fichier JSON
function saveMessages(messages) {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

// Charger les messages au démarrage
let messages = readMessages();

// Héberger les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté');
  
  // Envoyer l'historique des messages à l'utilisateur
  socket.emit('loadMessages', messages);

  // Recevoir et émettre un message
  socket.on('sendMessage', (message) => {
    console.log('Message reçu :', message);
    messages.push(message);
    saveMessages(messages);
    io.emit('receiveMessage', message);
  });

  // Recevoir et émettre une image
  socket.on('sendImage', (message) => {
    console.log('Image reçue :', message);
    messages.push(message);
    saveMessages(messages);
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
