/**
 * User Controller
 *
 * Controlls user actions
 **/

var async = require('async');
var UserRepository = require('../model/UserRepository');
var userRepository = new UserRepository();

var User = function(){};

module.exports = User;

User.prototype.findUserById = function(uid, callback){
    callback({uid:'lagranovskiy'});
}

User.prototype.registerUser = function (username, password, done) {
    console.info('Start authentication............');
    async.waterfall([function(callback){
     userRepository.findUser(username,callback);
    }],function(err,result){
         if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (result) {
            return done(null, result);
        } else {

            return  done(null, {uid:"Tester"});
        /*    // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function (err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });*/
        }
    })
   

}
User.prototype.findUser = function (request, response, next) {
    Console.info('Searching for a user in db');
}