// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var securityController = require('../controller/SecurityController');

// expose this function to our app using module.exports
module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function(uid, done) {
        console.info('Call from: ' + uid);
        securityController.resolveUser(uid, function(err, user) {
            done(err, user);
        });
    });

    /**
     * Registration authentication strategy
     */
    passport.use('local', new LocalStrategy({
        passReqToCallback: true
    }, securityController.authenticateUser));


    passport.use('localsign', new LocalStrategy({
        passReqToCallback: true
    }, securityController.registerUser));
};