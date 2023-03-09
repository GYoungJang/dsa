const socket = io('/chatting');

const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler
socket.on('user_connected', (userName) => {
  drawNewChat(`${userName}님이 입장하셨습니다!`);
});

socket.on('new_chat', (data) => {
  const { chat, userName } = data;
  drawNewChat(`${userName}: ${chat}`);
});

socket.on('disconnect_user', (userName) =>
  drawNewChat(`${userName}님이 퇴장하셨습니다.`),
);

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me : ${inputValue}`, true);
    event.target.elements[0].value = '';
  }
};

const drawHelloStranger = (userName) =>
  (helloStrangerElement.innerText = `Hello ${userName} :)`);

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
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
