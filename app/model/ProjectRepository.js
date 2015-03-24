var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Project = require('./Project'),
    db = new neo4j.GraphDatabase(config.db.url);

function ProjectRepository() {}



/**
 * Lists all projects in system
 *
 * @param {Function} retValCallback return value callback
 */
ProjectRepository.prototype.listAllProjects = function(retValCallback) {
    var query = [
        "MATCH (project:Project)",
        "RETURN project"
    ].join('\n');

    async.waterfall([

        function(callback) {
            db.query(query, {}, callback);
        },
        function(results, callback) {
            var projectList = [];
            _.each(results, function(project) {
                projectList.push(new Project(project.project));
            });

            retValCallback(null, projectList);
        }
    ]);
};


/**
 * Produces a new project according to the given projectData
 */
ProjectRepository.prototype.createNewProject = function(projectData, retValCallback) {
    var query = [
        "CREATE (project:Project{projectData})",
        "RETURN project"
    ].join('\n');

    var params = {
        projectData: projectData
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot create project with given properties.');
            }

            var createdProject = new Project(results[0].project);
            return callback(null, createdProject);
        }
    ], retValCallback);
};


/**
 * Saves given project by id with new data
 */
ProjectRepository.prototype.saveProject = function(projectId, projectData, retValCallback) {
    var query = [
        "MATCH (project:Project)",
        "WHERE id(project)={projectId}",
        "SET project = {projectData}",
        "RETURN project"
    ].join('\n');

    var params = {
        projectId: projectId,
        projectData: projectData
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot save project with given properties.');
            }

            var createdProject = new Project(results[0].project);
            return callback(null, createdProject);
        }
    ], retValCallback);
};


/**
 * Saves given project by id with new data
 */
ProjectRepository.prototype.deleteProject = function(projectId, retValCallback) {
    var query = [
        "MATCH (project:Project)-[relations]-(other)",
        "WHERE id(project)={projectId}",
        "DELETE project, relations"
    ].join('\n');

    var params = {
        projectId: projectId
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot create project with given properties.');
            }

            return callback(null, true);
        }
    ], retValCallback);
};

module.exports = ProjectRepository;