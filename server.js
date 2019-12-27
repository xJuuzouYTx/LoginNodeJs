var express = require('express');
var app = express();
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').config();
const path = require('path');
const exphbs = require('express-handlebars');

app.use(express.static(path.join(__dirname,'public')));
//For Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ 
    secret: 'keyboard cat',
    resave: true, 
    saveUninitialized:true
})); 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Models
var models = require('./models');

//load passport strategies
require('./config/passport.js')(passport, models.user);

 //Routes
var authRoute = require('./routes/auth.js')(app, passport);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});
