const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nationalParksSchema = new Schema({
    title: String,
    entry: String,
    description: String,
    location: String
});

module.exports = mongoose.model('NationalPark', nationalParksSchema);