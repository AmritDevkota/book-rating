const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema ({
    bookName: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'author'
    },
    rating: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('book', bookSchema);