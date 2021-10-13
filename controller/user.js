const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const User = require('../model/user');
const Book = require('../model/book');

exports.getSignUp = (req, res, next) => {
    const user = req.user;
    res.render('user/sign-up', {
        pageTitle: 'Sign Up!',
        user: user
    });
}

exports.postSignUp = (req, res, next) => {
    console.log('Signup Complete')
    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(user => {
            res.redirect('/');
        })
        .catch (error => {
            console.log('Something goes Wrong', error);
        })


}

exports.getLogin = (req, res, next) => {
    const user = req.user;
    res.render('user/login', {
        pageTitle: 'Login!',
        user: user
    });
}

exports.postLogin = (req, res, next) => {
    console.log('Login Complete')
    console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
    .then(user => {
        if (!user) {
            console.log('User not Found');
            return res.render('user/login')
        }
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    console.log('doMatch', doMatch);
                    req.session.user = user
                    return res.redirect('/')
                }
                console.log('Password Wrong');
                res.redirect('/login');
            })
            .catch (error => {
                console.log(error);
            })
    })
    .catch (error => {
        console.error(error);
    })
}

exports.getMe = (req, res, next) => {
    const user = req.user;

    console.log('User logged In', 'From Me', user);
    res.render('user/me', {
        pageTitle: 'My Profile',
        user: user
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
