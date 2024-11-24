// Remplace <ton-ngrok-url> par https://4890-2a01-e0a-d81-32d0-8938-7da2-5a51-1350.ngrok-free.app
const socket = io('https://4890-2a01-e0a-d81-32d0-8938-7da2-5a51-1350.ngrok-free.app');

// Fonction pour envoyer un message
function sendMessage() {
  const username = document.getElementById('username').value;
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const morseMessage = textToMorse(messageText);

  console.log('Envoi du message :', { username, text: messageText, morse: morseMessage });  // Vérifie le message avant l'envoi
  socket.emit('sendMessage', { username, text: messageText, morse: morseMessage });
  messageInput.value = '';
}

// Recevoir un message
socket.on('receiveMessage', (message) => {
  console.log('Message reçu :', message);  // Vérifie que le message est bien reçu
  messages.push(message);
  displayMessages();

  if (!isSoundMuted) {
    playMorseSound(message.morse);
  }
});

// Fonction pour afficher les messages
function displayMessages() {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = ''; // Réinitialiser la liste des messages
  messages.forEach(message => {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.innerHTML = `<p><strong>${message.username}</strong>: ${message.text} <br><strong>Morse:</strong> ${message.morse}</p>`;
    messagesDiv.appendChild(newMessageDiv);
  });
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

// Fonction pour couper/activer le son
function toggleSound() {
  isSoundMuted = !isSoundMuted;
}

// Fonction pour jouer le son en morse
function playMorseSound(morseMessage) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const unitTime = 100; // Durée en millisecondes pour un point

  let time = audioContext.currentTime;
  morseMessage.split('').forEach(char => {
    if (char === '.') {
      playTone(audioContext, time, unitTime);
      time += unitTime * 2;
    } else if (char === '-') {
      playTone(audioContext, time, unitTime * 3);
      time += unitTime * 4;
    } else if (char === ' ') {
      time += unitTime * 2;
    }
  });
}

function playTone(audioContext, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600, startTime);

  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(1, startTime);
  gainNode.gain.setValueAtTime(0, startTime + duration / 1000);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration / 1000);
}
