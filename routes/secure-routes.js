const express = require('express');
const router = express.Router();

router.get(
  '/profile',
  (req, res, next) => {
    // console.debug('profile secure-route query:', req.query);
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

module.exports = router;