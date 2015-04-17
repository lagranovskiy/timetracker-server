/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('neo-async');
var _ = require('underscore');
var newrelic=require('newrelic');

var ProjectModel = require('../model/ProjectModel');
var projectModel = new ProjectModel();

/**
 * Lists all projects where the user is assigned to and may create bookings
 *
 * @param   {Object}   request  request object
 * @param   {Object}   response response object
 * @param   {Function} next     callback for continious process
 * @returns {void}
 */
exports.listVisibleProjects = function(request, response, next) {
    var userId = request.user.id*1;
    console.info('Listing of visible projects of user ' + userId);

    projectModel.listVisibleProjects(userId, function(err, results) {
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
 * Returns visible projects of GIVEN user
 * @param request
 * @param response
 * @param next
 */
exports.listVisibleProjectsById = function(request, response, next) {
    var userId = request.params.userId*1;
    console.info('Listing of visible projects of user ' + userId);

    projectModel.listVisibleProjects(userId, function(err, results) {
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

    projectModel.listProjects(function(err, results) {
        if (err) {
            return next(err);
        }
        newrelic.recordMetric('Custom/Project/ProjectCount',results.length);
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

    projectModel.projectStatistic(projectId, function(err, statistic) {
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

    projectModel.projectResources(projectId, function(err, resources) {
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

    projectModel.projectBookings(projectId, function(err, bookings) {
        if (err) {
            return next(err);
        }

        response.send(bookings);
    });

};


/**
 * Creates a new project
 */
exports.createProject = function(request, response, next) {
    console.info('Creating project ');

    var projectData = request.body;
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }

    projectModel.createNewProject(projectData, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


/**
 * Saves existing project
 */
exports.saveProject = function(request, response, next) {

    var projectData = request.body;
    var projectId = request.params.projectId * 1;
    console.info('Saving project ' + projectId);
    if (!projectId) {
        return next('Cannot create project. No projectId found in request.');
    }
    if (!projectData) {
        return next('Cannot create project. No project data found in request.');
    }

    projectModel.saveProject(projectId, projectData, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


/**
 * Deletes a project
 */
exports.deleteProject = function(request, response, next) {
    var projectId = request.params.projectId*1;
    console.info('Deleting project ' + projectId);
    if (!projectId) {
        return next('Cannot create project. No projectId found in request.');
    }
    newrelic.incrementMetric('Custom/Project/DeletedProjects',1);
    projectModel.deleteProject(projectId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};