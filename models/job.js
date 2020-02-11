const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobsSchema = new Schema({
    jobname:String
});

module.exports = mongoose.model('jobs', jobsSchema, 'jobs');