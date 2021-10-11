const express = require('express');

const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bookRoutes);
app.use(userRoutes);

app.listen(port);
console.log("Server started at :", port);