const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const reviewSchema = new Schema({
    body : String,
    rating : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : User
    }
})

const review = mongoose.model('Review',reviewSchema)

module.exports = review