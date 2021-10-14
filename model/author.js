const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema ({
    authorName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('author', authorSchema);