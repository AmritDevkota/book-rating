const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');

const mongoose = require('mongoose');

const multer = require('multer');

const MONGOOB_URI = 'mongodb://localhost/book-rating';

const app = express();

const port = process.env.PORT || 3000;

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const errorController = require('./controller/error-controller');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        let newDate = new Date().toISOString()
        newDate = newDate.replace(":","-");
        newDate = newDate.replace(":","-");

        let name = newDate + "-" + file.originalname;
        // console.log('Value of name: ',name)
        cb(null, name);
    }
})

const fileFliter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb ( null, false);
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({ storage: fileStorage, fileFilter: fileFliter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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