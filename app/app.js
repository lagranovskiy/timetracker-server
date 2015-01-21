/**
 * Timetracker Server
 *
 * @ author Leonid Agranovskiy
 **/


// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

// configuration ================================================================

var config = require('./config/config');

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan((config.env === 'dev') ? 'dev' : 'tiny')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(methodOverride()); // simulate DELETE and PUT
app.use(cookieParser()); // read cookies (needed for auth)

// Configuring Passport
app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());

// load routes
require('./config/routes')(app, config, passport);

app.listen(config.port);
console.log('Timetracker server started successfully on port:' + config.port);