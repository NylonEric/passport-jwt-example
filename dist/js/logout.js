const logOut = () => {
  // TODO add message for logout
  // remove token in local storage
  localStorage.setItem('token', null);
  // refresh page
  window.location.reload();
};
document.getElementById("logout").onclick = (e) => {
  e.preventDefault();
  logOut();
  console.debug('clicked logout');
}; 