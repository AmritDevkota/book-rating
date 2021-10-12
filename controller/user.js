const bcrypt = require('bcryptjs');

const user = require('../model/user');

const User = require('../model/user');

exports.getSignUp = (req, res, next) => {
    res.render('user/sign-up');
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
            console.log('Something goes Wring', error);
        })


}

exports.getLogin = (req, res, next) => {
    res.render('user/login');
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

    console.log('User logged In');
    res.render('user/me', {
        user: user
    })
}
