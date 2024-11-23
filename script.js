// Dictionnaire Morse
const morseDict = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

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
});
