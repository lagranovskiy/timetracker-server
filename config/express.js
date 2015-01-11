var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');

/*var monitoring = require('../middleware/monitoring');*/

module.exports = function (app, config) {
    app.use(morgan((config.env === 'development') ? 'dev' : 'tiny')); // log every request to the console

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({
        secret: process.env.SESSION_SECRET || 'secretkey',
        cookie: {
            httpOnly: true,
            secure: false
        }
    }));


    /**
    TODO: Evaluate following middleware:
    Passport - Authentication
    Helmet - Security
    Morgan - logger (per default included)
    csurf - protection middleware
    winston - logger/ better?
*/
};