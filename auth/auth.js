const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model.js');

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      // console.debug('signup auth attempt:', email);
      try {
        const user = await UserModel.create({ email, password });
        // console.debug('signup auth success:', email);
        return done(null, user);
      } catch (error) {
        console.error('signup auth failure');
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
      // console.debug('in the login strategy', email, password);
      try {
        const user = await UserModel.findOne({ email });
        console.debug('login strategy, user found:', user);
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
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromUrlQueryParameter("secret_token"), ExtractJWT.fromHeader("secret_token"), ExtractJWT.fromAuthHeaderAsBearerToken()]),
    },
    async (token, done) => {
      // console.debug('here\'s the decoded token in the JWT strategy:', token);
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