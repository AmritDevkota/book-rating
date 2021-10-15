const Book = require('../model/book');
const User = require('../model/user');
const Review = require('../model/review');
const Author = require('../model/author');
const book = require('../model/book');

exports.getIndex = (req, res, next) => {
    const user = req.user;

    Book.find()
        .populate('author')
        .then(books => {
            res.render('book/index', {
                pageTitle: 'Home - Book Rating',
                books: books,
                user: user
            });
        })
        .catch (error => {
            console.log(error);
        })
}

exports.getAuthors = (req, res, next) => {
    const user = req.user;
    // console.log('User value: ', user);
    Author.find()
        .then(authors => {  
            res.render('book/authors',{
                pageTitle: 'Authors',
                user: user,
                authors: authors
            });
        })
}

exports.getAuthorDetail = (req, res, next) => {
    const user = req.user;
    const authorId = req.params.authorId;
    // console.log('User value: ', user);
    Author.findOne({
        _id: authorId
    })
        .then(author => {
            Book
            .find({
                author: authorId
            })
            .populate('author')
            .then(books => { 
                // console.log('Author value', author)
                // console.log('Books value', books)
                res.render('book/author-detail',{
                    pageTitle: 'Author Detail',
                    user: user,
                    author: author,
                    books: books
                });  
            })
        })
}

exports.getAddAuthor = (req, res, next) => {
    const user = req.user;
    if(!req.user.isAdmin){
        return res.send('You are not authoriazed to add author.')
    }
    Author.find()
        .then(authors => {
            // console.log('Value of Authors in getAddAuthor is ', authors, 'and .authorname is : ');
            res.render('book/add-author', {
                pageTitle: 'Add Book',
                user : user,
                authors : authors
            })
        })
}

exports.postAddAuthor = (req, res, next) => {
    const authorName = req.body.authorName;
    let image = req.file;
    if(image){
        image = image.path;
    }

    const author = new Author ({
        authorName: authorName,
        image: image
    })
    author
        .save()
        .then(result => {
            // console.log(result);
            // console.log('Successfully new author added in database.')
            res.redirect('/add-author');
            // res.send({Yeah: 'Successfully new author added in database.'})
        })
        .catch(error => {
            console.log('Failed to add new author in database', error)
            // res.send({Sorry: 'Failed to add new author in database'})
        })
}

exports.getAddBook = (req, res, next) => {
    // console.log(req.user, 'req.user from getAddBook');
    const user = req.user;
    const image = req.file;


    if (!req.user.isAdmin) {
        return res.send('You are not authorized to add book.')
    }
    Author.find()
        .then(authors => {
            res.render('book/add-book', {
                pageTitle: 'Add Book',
                user : user,
                authors : authors
            });
        })
};

exports.postAddBook = (req, res, next) => {
    const bookName = req.body.bookName;
    const image = req.file;
    const publishYear = req.body.publishYear;
    const authorName = req.body.author;
    const rating = req.body.rating;

    const bookImage = image.path;

    const book = new Book ({
        bookName: bookName,
        bookImage: bookImage,
        publishYear: publishYear,
        author: authorName,
        rating: rating
    });
    book
        .save()
        .then(result => {
            // console.log('Successful! saving book in database!');
            res.redirect('/');
            // next();
        })
        .catch(error => {
            console.log('Failed to save book in database', error)
        })

        // const author = new Author ({
        //     authorName: authorName,
        //     bookId: book._id
        // })
        // author
        //     .save()
        //     .then(author => {
        //         console.log('Author data created? author value from post add book', author);
        //         // next();
        //         res.redirect('/');
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
}

exports.getBookDetails = (req, res, next) => {

    const bookId = req.params.bookId;
    const user = req.user;
    
    Book.findById(bookId)
        .then(book => {
            Author.findOne({
                _id : book.author
            })
            .then(author => {
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
                                author: author,
                                myReview: myReview
                            })    
                        })
                    } else {
                        return res.render('book/book-details', {
                            book: book,
                            pageTitle: book.bookName,
                            reviews: reviews,
                            user: null,
                            author: author,
                            myReview: null
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
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