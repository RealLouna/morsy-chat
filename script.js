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

// Fonction pour envoyer un message
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const morseMessage = textToMorse(messageText);

  const messagesDiv = document.getElementById('messages');
  const newMessageDiv = document.createElement('div');
  newMessageDiv.innerHTML = `<p><strong>Texte:</strong> ${messageText}</p><p><strong>Morse:</strong> ${morseMessage}</p>`;
  messagesDiv.appendChild(newMessageDiv);
  
  messageInput.value = '';
}
