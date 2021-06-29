const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const NationalPark = require('./models/nationalParks');
const nationalParks = require('./models/nationalParks');
const ejsMate = require('ejs-mate');

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));

app.get('/', ( req, res ) => {
    res.render('home');
})

app.get('/nationalparks', async ( req, res ) => {
    const parks = await NationalPark.find({});
    res.render('parks/index', { parks });
})

app.get('/nationalparks/new', ( req, res ) => {
    res.render('parks/new');
})

app.post('/nationalparks', ( req, res ) => {
    const data = req.body;
    const newPark = new NationalPark(data);
    newPark.save();
    res.redirect('/nationalparks');
})

app.get('/nationalparks/:id/edit', async ( req, res) => {
    const id = req.params.id;
    const park = await NationalPark.findById(id);
    res.render('parks/edit', {park});
})



app.get('/nationalparks/:id', async ( req, res) => {
    const park = await NationalPark.findById(req.params.id);
    res.render('parks/show', { park });
})

app.put('/nationalparks/:id', async ( req, res ) => {
    const id = req.params.id;
    const data = req.body;
    const newPark =await NationalPark.findByIdAndUpdate(id,{...data});
    res.redirect(`/nationalparks/${id}`);
})

app.delete('/nationalparks/:id', async ( req, res ) => {
    const id = req.params.id;
    await NationalPark.findByIdAndDelete(id);
    res.redirect('/nationalparks');
})

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
    console.log(`Serving on Port: ${PORT}`);
})