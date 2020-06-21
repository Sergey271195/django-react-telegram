
console.log('Working')

var socket = new WebSocket("ws://localhost:8765");

socket.onopen = function() {
    console.log("Соединение установлено.");
    //socket.send('Hi from Js')
  };
  
socket.onclose = function(event) {
if (event.wasClean) {
    console.log('Соединение закрыто чисто');
} else {
    console.log('Обрыв соединения');
}
console.log('Код: ' + event.code + ' причина: ' + event.reason);
};
  
socket.onmessage = function(event) {
console.log("Получены данные " + event.data);
let div1 = document.getElementById('bot_message');
let div2 = document.getElementById('user_message');
let par = document.createElement('p');
response = JSON.parse(event.data);
response_data = response.data;
text = response_data.message.text
par.innerHTML = text
if (response_data.is_bot) {
    par.style.color = 'blue';
    div1.appendChild(par);
}
else {
    div2.appendChild(par);
}

};
  
socket.onerror = function(error) {
console.log("Ошибка " + error.message);
};