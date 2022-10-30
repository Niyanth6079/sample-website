const express = require('express');
const passport = require('passport');
const router = express.Router();

const CatchAsync = require('../utils/CatchAsync')
const users = require('../controllers/users')

router.get('/register', users.renderUserRegisterForm)

router.post('/register', CatchAsync(users.registerUser))

router.get('/login',users.renderLoginPage)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router;