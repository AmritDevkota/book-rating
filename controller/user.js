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