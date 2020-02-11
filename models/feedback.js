const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedBackSchema = new Schema({
    username:String,
    useroccupation:String,
    userfeedback:String,
    userimage:String,
    userid:Number,
    createdAt: Date,
    active:String
});

module.exports = mongoose.model('feedback', feedBackSchema, 'feedback');