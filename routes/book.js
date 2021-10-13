const express = require('express');

const bookController = require('../controller/book');

const isAuth = require('../auth/isAuth');

const isAdmin = require('../auth/isAdmin');

const router = express.Router();

router.get('/', bookController.getIndex);

router.get('/add-book', isAdmin, bookController.getAddBook);

router.post('/add-book', isAdmin, bookController.postAddBook);

router.get('/book-details/:bookId', bookController.getBookDetails);

router.post('/book-details/:bookId/review', isAuth, bookController.postBookReview);

module.exports = router;