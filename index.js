const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Joi = require('joi')
const NationalPark = require('./models/nationalParks');
const nationalParks = require('./models/nationalParks');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const dbURL = process.env.DATABASEURL || 'mongodb://localhost:27017/national-park';
mongoose.connect(dbURL, {
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

const validateNationalPark = ( req, res, next ) => {
    const nationalParksSchema = Joi.object({
        title: Joi.string().required(),
        entry: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    })
    const { error } = nationalParksSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', ( req, res ) => {
    res.render('home');
});

app.get('/nationalparks', catchAsync(async ( req, res ) => {
    const parks = await NationalPark.find({});
    res.render('parks/index', { parks });
}));

app.get('/nationalparks/new', ( req, res ) => {
    res.render('parks/new');
});

app.post('/nationalparks', validateNationalPark, catchAsync(async ( req, res, next ) => {
        // if(!req.body) throw new ExpressError('Invalid Data', 400);
        const data = req.body;
        const newPark = new NationalPark(data);
        await newPark.save();
        res.redirect('/nationalparks');
}));

app.get('/nationalparks/:id/edit', catchAsync(async ( req, res) => {
    const id = req.params.id;
    const park = await NationalPark.findById(id);
    res.render('parks/edit', {park});
}));

app.get('/nationalparks/:id', catchAsync(async ( req, res) => {
    const park = await NationalPark.findById(req.params.id);
    res.render('parks/show', { park });
}));

app.put('/nationalparks/:id', validateNationalPark, catchAsync(async ( req, res ) => {
    const id = req.params.id;
    const data = req.body;
    const newPark =await NationalPark.findByIdAndUpdate(id,{...data});
    res.redirect(`/nationalparks/${id}`);
}));

app.delete('/nationalparks/:id', catchAsync(async ( req, res ) => {
    const id = req.params.id;
    await NationalPark.findByIdAndDelete(id);
    res.redirect('/nationalparks');
}));

app.all('*', ( req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use(( err, req, res, next ) => {
    const {statusCode = 500, message = 'Something Went wrong'} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
});

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
    console.log(`Serving on Port: ${PORT}`);
});