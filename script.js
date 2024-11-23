// Dictionnaire Morse
const morseDict = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

let isDarkMode = false;
let isSoundMuted = false;

// Fonction pour convertir texte en morse
function textToMorse(text) {
  return text.toUpperCase().split('').map(char => morseDict[char] || char).join(' ');
}

// Initialiser Socket.IO
const socket = io('http://localhost:4000');

// Fonction pour envoyer un message
function sendMessage() {
  const username = document.getElementById('username').value;
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const morseMessage = textToMorse(messageText);

  socket.emit('sendMessage', { username, text: messageText, morse: morseMessage });
  messageInput.value = '';
}

// Recevoir un message
socket.on('receiveMessage', (message) => {
  const messagesDiv = document.getElementById('messages');
  const newMessageDiv = document.createElement('div');
  newMessageDiv.innerHTML = `<p><strong>${message.username}</strong>: ${message.text} <br><strong>Morse:</strong> ${message.morse}</p>`;
  messagesDiv.appendChild(newMessageDiv);

  if (!isSoundMuted) {
    playMorseSound(message.morse);
  }
});

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
