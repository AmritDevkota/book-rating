const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');

const mongoose = require('mongoose');

const MONGOOB_URI = 'mongodb://localhost/book-rating';

const app = express();

const port = process.env.PORT || 3000;

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const errorController = require('./controller/error-controller');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => {
    req.user = req.session.user;
    next();
})
app.use(bookRoutes);
app.use(userRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGOOB_URI)
    .then(result => {
        console.log('Database connected');
        app.listen(port);
        console.log("Server started at :", port);
    })
    .catch(error => {
        console.log(error);
    })