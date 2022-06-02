const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ email, password });
        console.log('signup auth sucess:', email, password);
        return done(null, user);
      } catch (error) {
        console.debug('signup auth failure');
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      console.debug('in the login strategy');
      try {
        const user = await UserModel.findOne({ email });
        console.debug('in usermodel?', user);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      session: false,
      secretOrKey: 'TOP_SECRET',
      // jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromUrlQueryParameter('secret_token'), ExtractJWT.fromAuthHeaderAsBearerToken()]),
      // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // ! needed for socket.io
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
    },
    async (token, done) => {
      console.debug('here\'s the decoded token in the auth:', token);
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports ={
  passport,
};