const express = require('express');

const router = express.Router();

const bookController = require('../controller/book');

router.get('/', bookController.getIndex);

module.exports = router;