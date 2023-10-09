const express = require('express');
const router = express.Router();
const { signup, createUser, signin, login, logout, disconnect } = require('../controlleur/sign_controller')

router.get('/signin', signin);
router.post('/signin/login', login);

router.get('/signup', signup);
router.post('/signup/create', createUser);

router.get('/logout', logout);
router.post('/logout/disconnect', disconnect);

module.exports = router;