const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const path = require('path');

// mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useMongoClient: true });
mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useCreateIndex", true);
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

const { passport } = require('./auth/auth');

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

const app = express();

// socket.io initialization
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: `http://127.0.0.1:${PORT}`,
    methods: ['*'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  }
})

const sendTime = () => {
  io.emit('time', { time: new Date().toJSON() });
  // console.debug('time emitted:');
}

setInterval(sendTime, 5000);

io.on('connection', (socket) => {
  // Use socket to communicate with this particular client only, sending it it's own id
  console.debug('socket connection initiated. socket.id: ', socket.id);
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });

  socket.on('i-am-client', (data) => {
    console.log('client message: ', data);
  });
});

// middleware for http app requests:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));

app.use('/', (req, res, next) => {
  // console.debug('query:', req.query);
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

module.exports = {
  server,
}