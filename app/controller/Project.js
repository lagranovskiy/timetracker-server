/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var ProjectRepository = require('../model/ProjectRepository');
var projectRepository = new ProjectRepository();
var Project = require('../model/Project');
var ProjectAssignmentRepository = require('../model/ProjectAssignmentRepository');
var projectAssignmentRepository = new ProjectAssignmentRepository();

/**
 * Lists all projects where the user is assigned to and may create bookings
 *
 * @param   {Object}   request  request object
 * @param   {Object}   response response object
 * @param   {Function} next     callback for continious process
 * @returns {void}
 */
exports.listVisibleProjects = function(request, response, next) {
    var userId = request.user.id;
    console.info('Listing of visible projects of user ' + userId);

    projectAssignmentRepository.listProjectsOfPerson(userId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.json({
            success: true,
            total: results.length,
            records: results
        });
    });
};


/**
 * Returns a list of all existing projects
 * TODO: Make the response parametrized with start, skip
 */
exports.listProjects = function(request, response, next) {
    console.info('Listing of all projects');
    projectRepository.listAllProjects(function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


/**
 * Retrvieve project statistics
 */
exports.projectStatistic = function(request, response, next) {
    var projectId = request.params.projectId * 1;
    console.info('Resolving project statistics for project ' + projectId);

    if (!projectId) {
        return next('Cannot resolve project statistics. No projectId found in request.');
    }

    projectRepository.resolveProjectStatistics(projectId, function(err, statistic) {
        if (err) {
            return next(err);
        }

        response.send(statistic);
    });
};


/**
 * Retrieve project resources
 */
exports.projectResources = function(request, response, next) {
    var projectId = request.params.projectId * 1;
    console.info('Resolving project resources for project ' + projectId);

    if (!projectId) {
        return next('Cannot resolve project resources. No projectId found in request.');
    }

    projectRepository.resolveProjectResources(projectId, function(err, resources) {
        if (err) {
            return next(err);
        }

        response.send(resources);
    });
};


/**
 * Retrieve project bookings
 */
exports.projectBookings = function(request, response, next) {
    var projectId = request.params.projectId * 1;
    console.info('Resolving project bookings for project ' + projectId);

    if (!projectId) {
        return next('Cannot resolve project bookings. No projectId found in request.');
    }

    projectRepository.resolveProjectBookings(projectId, function(err, bookings) {
        if (err) {
            return next(err);
        }

        response.send(bookings);
    });

};


exports.createProject = function(request, response, next) {
    var projectData = request.body;
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }

    var newProject = new Project(null, projectData);
    // Security check. get only allowed Properties
    // projectData = _.pick(projectData, 'projectName', 'projectId', 'customerName', 'description');

    projectRepository.createNewProject(newProject, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


exports.saveProject = function(request, response, next) {
    var projectData = request.body;
    var projectId = request.params.projectId;

    if (!projectId) {
        return next('Cannot create project. No projectId found in request.');
    }
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }
    var newProject = new Project(projectId, projectData);
    // Security check. get only allowed Properties
    // projectData = _.pick(projectData, 'projectName', 'projectId', 'customerName', 'description');

    projectRepository.saveProject(projectId, newProject, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

exports.deleteProject = function(request, response, next) {
    var projectId = request.params.projectId;

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