 // const jwt_decode = require('jwt-decode');
 const checkUser = () => {
  let token = localStorage.getItem('token');
  if (token && typeof token === 'string' && token.length > 0) {
    let decoded = jwt_decode(token);
    let user = decoded?.user?.email;
    document.getElementById('user').append(`Currently logged in: ${user}`);
    // console.debug('user', decoded.user.email);
  }
}
checkUser();