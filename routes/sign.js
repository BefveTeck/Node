const express = require('express');
const router = express.Router();
const { signup, createUser, signin, login, logout} = require('../controlleur/sign_controller')

router.get('/signin', signin);
router.post('/login', login);

router.get('/signup', signup);
router.post('/signin/create', createUser);

router.post('/logout', logout);

module.exports = router;