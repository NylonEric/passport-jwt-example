const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const UserModel = require('./model/model');

// mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useMongoClient: true });
mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useCreateIndex", true);
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});