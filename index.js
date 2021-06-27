const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const NationalPark = require('./models/nationalParks');

mongoose.connect('mongodb://localhost:27017/national-park', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.get('/', ( req, res ) => {
    res.render('home');
})

app.get('/nationalparks', async ( req, res ) => {
    const parks = await NationalPark.find({});
    res.render('parks/index', { parks });
})
app.get('/addNationalPark', async ( req, res) => {
    res.redirect('/');
})

app.listen(3000, () => console.log('Serving on port 3000'));