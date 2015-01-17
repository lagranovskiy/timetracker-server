// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../controller/User'),
    user = new User();

// expose this function to our app using module.exports
module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function (id, done) {
        user.findUserById(id, function (err, user) {
            done(err, user);
        });
    });

    /**
     * Registration authentication strategy
     */
    passport.use('local-signup', new LocalStrategy(user.registerUser));


};