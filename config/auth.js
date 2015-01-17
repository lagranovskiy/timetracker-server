var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
    * Configure Authentication
    ***/
    
module.exports = function (app) {
     // Configure Authentication
    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.error('Authentication started:' + username + ':' + password);
            done(null, 'tester');
         /*   User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });*/
        }
    ));

    passport.serializeUser(function(user, done) {
      done(null,'Tester');
    });

    passport.deserializeUser(function(id, done) {
          done(err, 'Tester');
   /*   User.findById(id, function(err, user) {
        done(err, user);
      });*/
    });
}