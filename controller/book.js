const Book = require('../model/book');
const User = require('../model/user');
const Review = require('../model/review');
const review = require('../model/review');

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

exports.getAddBook = (req, res, next) => {
    // console.log(req.user, 'req.user from getAddBook');
    const user = req.user;

    if (!req.user.isAdmin) {
        return res.send('You are not authorized to add book.')
    }
    res.render('user/add-book', {
        pageTitle: 'Add Book',
        user : user
    });
};

exports.postAddBook = (req, res, next) => {
    const bookName = req.body.bookName;
    const publishYear = req.body.publishYear;
    const author = req.body.author;
    const rating = req.body.rating;

    const book = new Book ({
        bookName: bookName,
        publishYear: publishYear,
        author: author,
        rating: rating
    });
    book
        .save()
        .then(result => {
            console.log('Successful! saving book in database!');
            res.redirect('/');
        })
        .catch(error => {
            console.log('Failed to save book in database', error)
        })
}

exports.getBookDetails = (req, res, next) => {

    const bookId = req.params.bookId;
    const user = req.user;
    
    Book.findById(bookId)
        .then(book => {
            Review.find({
                book: bookId
            })
            .populate('user')
            .then(reviews => {
                if (user) {
                    Review.findOne({
                        book: bookId,
                        user: user._id
                    })
                    .populate('user')
                    .then(myReview => {
                        // console.log(reviews)
                        return res.render('book/book-details', {
                            book: book,
                            pageTitle: book.bookName,
                            reviews: reviews,
                            user: user,
                            myReview: myReview
                        })    
                    })
                } else {
                    return res.render('book/book-details', {
                        book: book,
                        pageTitle: book.bookName,
                        reviews: reviews,
                        user: null,
                        myReview: null
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        })
}

exports.postBookReview = (req, res, next) => {
    const bookId = req.params.bookId;
    const user = req.user;
    const userId = req.user._id;
    const userReview = req.body.review;
    const userRating = req.body.userRating;

    Review.findOne({
        user: user._id,
        book: bookId
    }).then (review => {
        if (review) {
            review.rating = userRating
            review.review = userReview
            return review.save();
        } else {
            review = new Review ({
                review: userReview,
                rating: userRating,
                user:  userId,
                book: bookId
            });
            return review.save();  
        }
    })
    .then(review => {
        res.redirect('/book-details/'+bookId)
    })
    .catch(error => {
        console.log(error);
    })
}