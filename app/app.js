/**
 * Timetracker Server
 * PAC Project
 *
 * @ author Leonid Agranovskiy
 **/


// set up ======================================================================
// get all the tools we need
require('newrelic');
var express = require('express');
var app = express();


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var fs = require('fs');



var http = require('http');
var https = require('https');

// configuration ================================================================

var config = require('./config/config');

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan((config.env === 'dev') ? 'dev' : 'tiny')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(methodOverride()); // simulate DELETE and PUT
app.use(cookieParser(config.sessionSecret)); // read cookies (needed for auth)

// Configuring Passport
app.use(expressSession({
    secret: config.sessionSecret,
    proxy : true,
    cookie: {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));


app.use(passport.initialize());
app.use(passport.session());

// load routes
require('./config/routes')(app, config, passport);


/**
    Configure if http server need to be still created
*/
if (config.httpPort) {
    var httpServer = http.createServer(app);
    httpServer.listen(config.httpPort);
    console.log('Timetracker server startet under http://' + config.host + ':' + config.httpPort);
}

if (config.sslPort) {
    /**
     * Read HTTPS Certificates
     */
    var httpsCertificates = {
        key: fs.readFileSync(config.options.key, 'utf8'),
        cert: fs.readFileSync(config.options.cert, 'utf8')
    };

    var httpsServer = https.createServer(httpsCertificates, app);
    httpsServer.listen(config.sslPort);
    console.log('Timetracker server startet under https://' + config.host + ':' + config.sslPort);
}

console.log('Timetracker server started successfully on port: HTTP ' + config.httpPort + ' and HTTPS ' + config.sslPort);

module.exports = app;