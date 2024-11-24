let messages = [];
let isDarkMode = false;

// Initialiser Socket.IO
const socket = io('https://reallouna.loca.lt');

// Charger les messages à la connexion
socket.on('loadMessages', (loadedMessages) => {
  messages = loadedMessages;
  displayMessages();
});

// Fonction pour envoyer un message
function sendMessage() {
  const username = document.getElementById('username').value;
  const color = document.getElementById('color').value;
  const emoji = document.getElementById('emoji').value;
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;

  console.log('Envoi du message :', { username, text: messageText, color, emoji });
  socket.emit('sendMessage', { username, text: messageText, color, emoji });
  messageInput.value = '';
}

// Recevoir un message
socket.on('receiveMessage', (message) => {
  console.log('Message reçu :', message);
  messages.push(message);
  displayMessages();
});

// Fonction pour afficher les messages
function displayMessages() {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = ''; // Réinitialiser la liste des messages
  messages.forEach(message => {
    const newMessageDiv = document.createElement('div');
    if (message.image) {
      newMessageDiv.innerHTML = `<p><strong style="color: ${message.color};">${message.username} ${message.emoji}</strong>: <img src="${message.image}" alt="${message.description}" style="max-width: 100%; height: auto;">${message.description}</p>`;
    } else {
      newMessageDiv.innerHTML = `<p><strong style="color: ${message.color};">${message.username} ${message.emoji}</strong>: ${message.text}</p>`;
    }
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
      const description = document.getElementById('image-description').value;
      console.log('Envoi de l\'image :', { username, color, emoji, image: imageData, description });
      socket.emit('sendImage', { username, color, emoji, image: imageData, description });
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
