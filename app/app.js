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
var RedisStore = require('connect-redis')(expressSession);
var passport = require('passport');
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

    /***
     * Initlialize redis
     */
    var redis = require('redis-url').connect(config.redis.url);
    var redisStore = new RedisStore({
        client: redis,
        ttl: 24 * 60 * 60
    });

    // Configuring Passport
    var session = expressSession({
        secret: config.sessionSecret,
        resave: false,
        store: redisStore,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    });
    app.use(session);


    app.use(passport.initialize());
    app.use(passport.session());

    // load routes
    require('./config/routes')(app, passport);
    require('./config/eventPopulator')(config);

    var socketServer = null;
    /**
     Configure if http server need to be still created
     */
    if (config.httpPort) {
        var httpServer = http.createServer(app).listen(config.httpPort);

        if (!config.sslPort) {
            // Only enable unsecured sockets if no https connection is configured
            socketServer = httpServer;
        }

        console.log('Timetracker server started under http://' + config.host + ':' + config.httpPort);
    }

    if (config.sslPort) {
        /**
         * Read HTTPS Certificates
         */
        var httpsCertificates = {
            key: fs.readFileSync(config.options.key, 'utf8'),
            cert: fs.readFileSync(config.options.cert, 'utf8')
        };

        var httpsServer = https.createServer(httpsCertificates, app).listen(config.sslPort);
        socketServer = httpsServer;
        console.log('Timetracker server started under https://' + config.host + ':' + config.sslPort);
    }

    var io = require('socket.io')(socketServer);
    /*  io.use(function (socket, next) {
     //      session(socket.request, socket.request.res, next);
     });*/
    var passportSocketIo = require('passport.socketio');
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,       // the same middleware you registrer in express
        key: 'connect.sid',       // the name of the cookie where express/connect stores its session_id
        secret: config.sessionSecret,    // the session_secret to parse the cookie
        store: redisStore,        // we NEED to use a sessionstore. no memorystore please
        fail: function (data, message, error, accept) {
            if (error)
                accept(new Error(message));
            console.error('failed connection to socket.io:', message);
        },
        success: function (data, accept) {
            console.log('successful connection to socket.io');
            accept();
        }
    }));

    io.set('transports', ['websocket', 'polling', 'xhr-polling']);
    io.set('origins', '*:*');

    require('./config/sockets')(io, config);

    return app;
};

exports.app = exports.setup(app);
