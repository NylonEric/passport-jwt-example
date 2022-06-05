const addMessage = (message) => {
  let text = document.createTextNode(message);
  let el = document.createElement('li');
  let messages = document.getElementById('messages');
  el.appendChild(text);
  messages.appendChild(el);
};
var socket;
const setSocket = (socket) => {
  socket = io({
    extraHeaders: {
      Authorization: 'Bearer ' +  localStorage.getItem('token'),
    },
  });
  socket.on('welcome', (data) => {
    addMessage(data.message);

    // Respond with a message including this clients' id sent from the server
    socket.emit('i-am-client', {data: 'foo!', id: data.id});
  });
  socket.on('time', (data) => {
    // console.log('here is time event:', data);
    addMessage(data.time);
  });
  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));
  checkUser();
};
setSocket(socket);   