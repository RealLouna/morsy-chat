let messages = [];

// Initialiser Socket.IO
const socket = io('http://localhost:4000');  // Remplace par ton URL si nécessaire

// Fonction pour envoyer un message
function sendMessage() {
  const username = document.getElementById('username').value;
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;

  console.log('Envoi du message :', { username, text: messageText });  // Vérifie le message avant l'envoi
  socket.emit('sendMessage', { username, text: messageText });
  messageInput.value = '';
}

// Recevoir un message
socket.on('receiveMessage', (message) => {
  console.log('Message reçu :', message);  // Vérifie que le message est bien reçu
  messages.push(message);
  displayMessages();
});

// Fonction pour afficher les messages
function displayMessages() {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = ''; // Réinitialiser la liste des messages
  messages.forEach(message => {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.innerHTML = `<p><strong>${message.username}</strong>: ${message.text}</p>`;
    messagesDiv.appendChild(newMessageDiv);
  });
}

// Actualiser la liste des messages toutes les secondes
setInterval(() => {
  displayMessages();
}, 1000);
	