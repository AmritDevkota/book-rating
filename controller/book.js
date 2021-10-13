const Book = require('../model/book');
const User = require('../model/user');

exports.getIndex = (req, res, next) => {
    const user = req.user;

    Book.find()
        .then(books => {
            res.render('book/index', {
                pageTitle: 'Home - Book Rating',
                books: books,
                // bookName: bookName,
                user: user
            });
        })
}

exports.getBookDetails = (req, res, next) => {
    const bookId = req.params.bookId;
    const user = req.user;
    Book.findById(bookId)
        .then(book => {
            res.render('book/book-details', {
                book: book,
                pageTitle: book.bookName,
                user: user
            })
        })
}

exports.postBookDetails = (req, res, next) => {
    const bookId = req.params.bookId;
    const user = req.user;
    const review = req.body.review;
    const userRating = req.body.userRating;
    Book.findById(bookId)
        .then(book => {
            res.render('book/book-details', {
                book: book,
                pageTitle: book.bookName,
                user: user
            })
        })
}