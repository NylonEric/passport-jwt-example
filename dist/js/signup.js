document.forms['signup'].addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO do something here to show user that form is being submitted
  fetch(event.target.action, {
      method: 'POST',
      body: new URLSearchParams(new FormData(event.target)) // event.target is the form
  }).then((response) => {
    // console.debug('signup submition response:', response);
      return response.json();
  }).then((body) => {
    // console.debug('signup successful:', body);
    addMessage('Signup success!');
    setTimeout(() => {
      window.location.reload()}, 1000);
  }).catch((error) => {
    console.error('error in form submit', error);
  });
});