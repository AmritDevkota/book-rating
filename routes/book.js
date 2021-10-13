const express = require('express');

const router = express.Router();

const bookController = require('../controller/book');

router.get('/', bookController.getIndex);

router.get('/book-details/:bookId', bookController.getBookDetails);

module.exports = router;