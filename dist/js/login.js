// js for login functionality

document.forms['login'].addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO do something here to show user that form is being submitted
  fetch(event.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(event.target)) // event.target is the form
  }).then((response) => {
  // console.debug('login form submition response:');
  return response.json();
  }).then((body) => {
    // console.debug('here is the body text:', body);
    // save jwt to local storage:
    if (body?.token) {
      localStorage.setItem('token', body?.token);
      addMessage('login successful:', body?.token);
      setSocket(socket);
    } else {
      addMessage('login fail');
    }
  }).catch((error) => {
    console.error('error in form submit', error);
  });
});