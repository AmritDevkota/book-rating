const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema ({
    authorName: {
        type: String,
        required: true
    },
    image:{
        type: String
    }
})

module.exports = mongoose.model('author', authorSchema);