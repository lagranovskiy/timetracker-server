/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
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
    var userId = request.session.user.getUid();
    projectRepository.listVisibleProjects(userId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

/**
 * Returns a list of all existing projects
 * TODO: Make the response parametrized with start, skip
 */
exports.listAllProjects = function(request, response, next) {
    projectRepository.listAllProjects(function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


exports.createNewProject = function(request, response, next) {
    var projectData = request.body;
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }
    // Security check. get only allowed Properties
    projectData = _.pick(projectData, 'projectName', 'projectId', 'customerName', 'description');

    projectRepository.createNewProject(projectData, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


exports.saveProject = function(request, response, next) {
    var projectData = request.body;
    var projectId = request.param.projectId;

    if (!projectId) {
        return next('Cannot create project. No projectId found in request.');
    }
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }
    // Security check. get only allowed Properties
    projectData = _.pick(projectData, 'projectName', 'projectId', 'customerName', 'description');

    projectRepository.saveProject(projectId, projectData, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

exports.deleteProject = function(request, response, next) {
    var projectId = request.param.projectId;

    if (!projectId) {
        return next('Cannot create project. No projectId found in request.');
    }

    projectRepository.deleteProject(projectId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};