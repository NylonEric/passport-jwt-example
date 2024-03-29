const routes = (passport) => {
  const express = require('express');
  const jwt = require('jsonwebtoken');
  const router = express.Router();

  router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
      console.debug('success signup!', req.user);
      res.json({
        message: 'Signup successful',
        user: req.user
      });
    }
  );

  router.post(
    '/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
              return next(error);
            }
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'TOP_SECRET');
                console.debug('success!', token);
                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );
  return router;
};

module.exports = (passport) => {
  return routes(passport)
};