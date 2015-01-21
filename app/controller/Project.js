/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var ProjectRepository = require('../model/ProjectRepository');
var projectRepository = new ProjectRepository();

/**
 * Lists all projects where the user is assigned to and may create bookings
 *
 * @param   {Object}   request  request object
 * @param   {Object}   response response object
 * @param   {Function} next     callback for continious process
 * @returns {void}
 */
exports.listVisibleProjects = function(request, response, next) {
    async.waterfall([
        function(callback) {
            projectRepository.listVisibleProjects('mmustermann', callback);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

exports.listAllProjects = function(request, response, next) {
    async.waterfall([
        function(callback) {
            projectRepository.listAllProjects(callback);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};


exports.saveProject = function(request, response, next) {
    async.waterfall([
        function(callback) {
            callback(null, []);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};

exports.createNewProject = function(request, response, next) {
    async.waterfall([
        function(callback) {
            callback(null, []);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};

exports.deleteProject = function(request, response, next) {
    async.waterfall([
        function(callback) {
            callback(null, []);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};
