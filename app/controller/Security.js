/**
 * User Controller
 *
 * Controlls user actions
 **/

var async = require('async');
var _ = require('underscore');
var UserRepository = require('../model/UserRepository');
var userRepository = new UserRepository();
var md5 = require('MD5');


/** 
 * Sends auth data to the user
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
exports.sendAuthData = function(req, res) {
    if (req.user === undefined) {
        return res.status(500).send('No active session found.');
    }

    res.status(200).json({
        id: req.user.id,
        userId: req.user.uid,
        groups: req.user.groups,
        session: req.sessionID
    });
};

/**
 * Performs user logout
 *
 * @param {Object} req request
 * @param {Object}   res resonse
 */
exports.logout = function(req, res, next) {
    if (req.user === undefined) {
        return res.status(500).send('No active session found.');
    }

    console.info('Session ' + req.sessionID + ' closed. User ' + req.user.uid + ' logger out.');
    req.logOut();
    res.clearCookie('connect.sid');
    res.status(200).send('Logged out');
};


/**
 * Search for user entry in db and resolve it
 *
 * @param   {String}   uid      Userid to be searched
 * @param   {Function} callback function that need to be callbacked
 * @returns {Function} callback
 */
exports.resolveUser = function(uid, done) {
    async.waterfall([

        function(callback) {
            return userRepository.getUser(uid, callback);
        }
    ], function(error, user) {
        if (error) {
            console.info('Cannot find User ' + uid + ':' + error);
        }
        return done(error, user);
    });
};

/**
 * Process user authorization
 *
 * @param {String}   username Username
 * @param {String}   password Password
 * @param {Function} done Callback funtion
 */
exports.authenticateUser = function(req, uid, password, done) {
    console.info('Start login process.');
    async.waterfall([

        function(callback) {
            return userRepository.getUser(uid, callback);
        },

        function(user, callback) {
            if (!user) {
                return callback(null, false);
            }
            var authenticationResult = md5(password) === user.pwdHash;
            if (authenticationResult) {
                console.info('User ' + uid + ' logged in.');
                callback(null, user);
            } else {
                console.info('User ' + uid + ' password wrong');
                callback(null, false);
            }
        }

    ], function(error, user) {
        if (error) {
            console.info('Cannot login User ' + uid + ':' + error);
        }
        return done(error, user);
    });
};


/**
 * Registers user and authenticates it at the same time
 *
 * @param   {Object}   req      request
 * @param   {String}   username username
 * @param   {String}   password password
 * @param   {Function} done     done funtion of passport
 * @returns {Function} return registered user or fail.
 */
exports.registerUser = function(req, username, password, done) {
    console.info('Start registration of user:' + username);

    async.waterfall([

        function(callback) {
            userRepository.findUser(username, callback);
        },
        function(user, callback) {
            // If user found, break and send error code to client
            if (user) {
                return callback('Username already exist!');
            }

            var userData = req.body;

            // Security check. get only allowed Properties
            var securedUserData = _.pick(userData, 'forename', 'surname', 'birthday', 'email', 'phone', 'username');

            // Fill missing values like password hash
            securedUserData.uid = username;
            securedUserData.passwordMD5 = md5(password);
            securedUserData.registrationDate = new Date().toDateString();
            userRepository.createUserWithPerson(securedUserData, callback);
        }
    ], function(error, user) {
        if (error) {
            console.info('Cannot register User ' + username + ':' + error);
        }
        req.session.user = user;
        done(error, user);

    });


};