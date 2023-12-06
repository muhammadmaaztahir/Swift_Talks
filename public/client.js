const socket = io('http://localhost:9000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('Ringtone/Ringtone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = ''
})

const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

socket.on('user-joined', newUser => {
    append(`${newUser} joined the chat`, 'right')
})

socket.on('receive', data => {
    append(`${data.name || 'Unknown User'}: ${data.message}`, 'left');
});

socket.on('left', userName => {
    append(`${userName} left the chat`, 'right')
})