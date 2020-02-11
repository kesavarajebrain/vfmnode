const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const audiorjSchema = new Schema({
    rjID:String,
    rjAccountId:String,
    status:String,
    uploadDate:String,
    rjAudio:String
});

module.exports = mongoose.model('audiorj', audiorjSchema, 'audiorj');