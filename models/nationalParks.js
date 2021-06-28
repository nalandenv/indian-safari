const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nationalParksSchema = new Schema({
    title: String,
    image: String,
    entry: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('NationalPark', nationalParksSchema);