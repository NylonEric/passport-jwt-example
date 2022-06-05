const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const path = require('path');
// const { mongoose } = require('./mongo/db');

const { passport } = require('./auth/auth');
const routes = require('./routes/routes.js')(passport);
const secureRoutes = require('./routes/secure-routes');
const app = express();

// middleware for http app requests:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));

app.use('/', (req, res, next) => {
  console.debug('query:', req.query);
  next();
})

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// socket.io initialization
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: `http://127.0.0.1:${PORT}`,
    methods: ['*'],
    allowedHeaders: ['authorization'],
    credentials: true,
  }
})

// ? A timed server message for testing in the browser. note: this broadcasts to all io connections, not just one socket.
const sendTime = () => {
  io.emit('time', { time: new Date().toJSON() });
  // console.debug('time emitted:');
}

setInterval(sendTime, 1000);

// socket.io middleware:
const wrap_socket_middleware = (middleware) => (socket, next) => {
  return middleware(socket.request, {}, next); // ! pay special attention to how this wrapper adds the 3 arguments expected of http middleware and maps to the 2 for sockets
}

io.use((socket, next) => {
  // console.debug('socket middleware on connection!', Object.keys(socket.handshake));
  // console.debug('user before auth:', socket.request.user);
  next();
});

// wrapped middleware to use authentiction strategy:
io.use(wrap_socket_middleware(passport.authenticate('jwt', { session: false })));

io.use((socket, next) => {
  // console.debug('socket middleware after auth middleware! lets see if there\'s a user:');
  if (socket.request.user) {
    // console.debug('user after auth:', socket.request.user);
    next();
  } else {
    console.debug('no user after auth');
    next(new Error('unauthorized'));
  }
});

io.on('connection', (socket) => {
  // Use socket to communicate with this particular client only, sending it it's own id
  console.log('socket connection initiated. socket.id: ', socket.id);
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });

  socket.on('i-am-client', (data) => {
    console.log('client message: ', data);
  });
  socket.on('disconnect', (data) => {
    console.debug(`socket.id: ${socket.id} disconnected. more info: ${data}`);
  })
});

module.exports = {
  server,
}