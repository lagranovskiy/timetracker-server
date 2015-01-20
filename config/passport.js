// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var security = require('../controller/Security');

// expose this function to our app using module.exports
module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user.getUid());
    });

    passport.deserializeUser(function (uid, done) {
        console.info('Call from: ' + uid);
        security.resolveUser(uid, function (err, user) {
            done(err, user);
        });
    });

    /**
     * Registration authentication strategy
     */
    passport.use('local', new LocalStrategy({passReqToCallback : true}, security.authenticateUser));
    passport.use('local-signup', new LocalStrategy({passReqToCallback : true}, security.registerUser));


};