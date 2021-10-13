const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    book: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'book'
    }
})

module.exports = mongoose.model('review', reviewSchema);