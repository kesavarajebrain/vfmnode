const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rjSchema = new Schema({
    rjName:String,
    rjNumber:String,
    rjEmail:String,
    rjPassword:String,
    rjCity:String,
    rjId:String,
    rjShortName:String,
    rjStatus:String,
    rjJoin:String
});

module.exports = mongoose.model('rj', rjSchema, 'rj');