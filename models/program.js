const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const programsSchema = new Schema({

    prgAudioUrl:String,
    prgCollection:String,
    prgImgUrl:String,
    prgMarqueeMsg:String,
    prgTitle:String,
    uploaddate:String,
    active:String,
    modifiedAt:String
});

module.exports = mongoose.model('programs', programsSchema, 'programs');