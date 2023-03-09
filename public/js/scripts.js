const socket = io('/chatting');

const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler
socket.on('user_connected', (userName) => {
  drawNewChat(`${userName} connected!`);
});

socket.on('new_chat', (data) => {
  const { chat, userName } = data;
  drawNewChat(`${userName}: ${chat}`);
});

socket.on('disconnect_user', (userName) => drawNewChat(`${userName}: bye...`));

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

const drawHelloStranger = (userName) =>
  (helloStrangerElement.innerText = `Hello ${userName} Stranger :)`);

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
      <div>
        ${message}
      <div>
      `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const userName = prompt('당신의 이름을 입력하세요.');
  socket.emit('new_user', userName, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();

  formElement.addEventListener('submit', handleSubmit);
}

init();
