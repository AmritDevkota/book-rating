const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

router.get('/rate-book', userController.getRateBook);

module.exports = router;