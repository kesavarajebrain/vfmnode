const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const donorSchema = new Schema({
    name:String,
    email:String,
    location:String,
    phonenumber:Number,
    joindate:String,
    active:String
});

module.exports = mongoose.model('donor', donorSchema, 'donor');