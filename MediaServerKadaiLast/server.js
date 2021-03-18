// check if we are running in the production environtment or not
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// importing libraries
const express = require('express');
const app = express();
const expresslayouts = require('express-ejs-layouts');
// npm i body-parser
const bodyParser = require('body-parser');
//npm i method-override
const methodOverride = require('method-override')

// REFERENCES
// make reference to routes folder
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');


// SET UP APPLICATION
// set view engine
app.set('view engine', 'ejs');
// set where our views coming from
app.set('views', __dirname+'/views');
// hook up express layouts
app.set('layout', 'layouts/layout');
// tell app to use Expresslayouts
app.use(expresslayouts);
//tell the app to use method-override
app.use(methodOverride('_method'));
// tell express where our public files are gonna be
app.use(express.static('public'));
app.use(bodyParser.urlencoded( { limit : '10mb', extended : false} ));

// SET UP DATABASE(MongoDB)
// import library(ies)
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true});
// log to DB (check we logged in or not to DB)
const db = mongoose.connection
db.on('error', error => console.error(error));
db.on('open', () => console.log('Connected to Mongoose'));

// tell our app/server to use the references and what router we want to handle
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

app.listen(process.env.PORT || 3000);

// ---------------------------------------------------------sETTING SERVER DONE HERE-------------------------------------------------------------------
