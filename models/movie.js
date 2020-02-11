const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieimg:String,
    moviename:String,
    uploaddate:String,
    songs: [
        {
            title: String,
            songsingers: String,
            link: String,
        }
      ]
});

module.exports = mongoose.model('movie', movieSchema, 'movie');