const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({ email, password: hashedPassword });
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.render('auth/login', { err: "User doesn't exist" });
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user;
    req.app.locals.loggedUser = user;
    res.redirect('/profile');
  } else {
    res.render('auth/login', { err: 'ME quieres ver la cara de stupida?' });
  }
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.render('auth/profile', loggedUser);
});

function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
