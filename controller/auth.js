/**
* Authentication Controller
*
* Controlls authentication of the users
**/
var express = require('express');

var auth = {};
exports = module.exports = auth;
auth.routes = express.Router();

/**
 * Default fallback
 */
auth.default = function (req, res, next) {
    res.send('400', 'METHOD NOT ALLOWED');
};

auth.login = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    console.info('auth: authenticating of the user: ' + username);
}

auth.logout = function(req, res, next){
    console.info('auth: logout called');
}

/* Default return on not allowed method */
auth.routes.get('/', auth.default);

/* Process User login and session initialization */
auth.routes.post('/', auth.login);

/* Process User logout */
auth.routes.delete('/', auth.logout);

