const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

const isAuth = require('../auth/isAuth');
const isAdmin = require('../auth/isAdmin');

router.get('/sign-up', userController.getSignUp);

router.post('/sign-up', userController.postSignUp);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/me',isAuth, userController.getMe);

module.exports = router;