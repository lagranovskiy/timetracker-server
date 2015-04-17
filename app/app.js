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


/**
 * Initialializes the application
 */
exports.setup = function (app) {


    // set up our express application
    app.use(morgan((config.env === 'dev') ? 'dev' : 'tiny')); // log every request to the console

    app.use(bodyParser.json()); // get information from html forms
    app.use(methodOverride()); // simulate DELETE and PUT
    app.use(cookieParser(config.sessionSecret)); // read cookies (needed for auth)

    app.set('trust proxy', 1); // trust first proxy

    // Configuring Passport
    app.use(expressSession({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // load routes
    require('./config/routes')(app, passport);

    return app;
};

exports.app = exports.setup(app);

/**
 Configure if http server need to be still created
 */
if (config.httpPort) {
    var httpServer = http.createServer(exports.app).listen(config.httpPort);
    var io = require('socket.io')(httpServer);
    require('./config/sockets')(io);
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

    var httpsServer = https.createServer(httpsCertificates, exports.app).listen(config.sslPort);
    var io = require('socket.io')(httpsServer);
    require('./config/sockets')(io);
    console.log('Timetracker server startet under https://' + config.host + ':' + config.sslPort);
}