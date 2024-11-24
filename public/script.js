let messages = [];
let isDarkMode = false;

// Initialiser Socket.IO
const socket = io('https://reallouna.loca.lt');

// Fonction pour envoyer un message
function sendMessage() {
  const username = document.getElementById('username').value;
  const color = document.getElementById('color').value;
  const emoji = document.getElementById('emoji').value;
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;

  console.log('Envoi du message :', { username, text: messageText, color, emoji });  // Vérifie le message avant l'envoi
  socket.emit('sendMessage', { username, text: messageText, color, emoji });
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
    newMessageDiv.innerHTML = `<p><strong style="color: ${message.color};">${message.username} ${message.emoji}</strong>: ${message.text}</p>`;
    messagesDiv.appendChild(newMessageDiv);
  });
  console.log('Messages affichés :', messages);  // Affiche les messages actuels dans la console
}

// Actualiser la liste des messages toutes les secondes
setInterval(() => {
  displayMessages();
}, 1000);

// Fonction pour basculer le mode sombre
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
}

// Fonction pour envoyer une image
function uploadImage() {
  const imageInput = document.getElementById('image-input');
  imageInput.click();
  imageInput.onchange = function() {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const username = document.getElementById('username').value;
      const color = document.getElementById('color').value;
      const emoji = document.getElementById('emoji').value;
      const imageData = e.target.result;
      socket.emit('sendImage', { username, color, emoji, image: imageData });
    };
    reader.readAsDataURL(file);
  };
}

// Recevoir une image
socket.on('receiveImage', (message) => {
  console.log('Image reçue :', message);
  messages.push(message);
  displayMessages();
});
