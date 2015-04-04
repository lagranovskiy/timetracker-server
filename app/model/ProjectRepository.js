var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Project = require('./Project'),
    Booking = require('./Booking'),
    db = new neo4j.GraphDatabase(config.db.url);

function ProjectRepository() {}


/**
 * ProjectRepository.prototype.resolveProjectStatistics - Resolves statistics of given project
 *
 * @param  {type} projectId      project id
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectRepository.prototype.resolveProjectStatistics = function(projectId, retValCallback) {

    var query = [
        "MATCH (p:Project)",
        "MATCH path= (p)<-[b:TIME_BOOKED]-()",
        "WHERE id(p)={projectId}",
        "RETURN ",
        "LENGTH(()-[:ON_PROJECT]-p) as ResourceCount,",
        "LENGTH(()-[:TIME_BOOKED]-p) as BookingsCount,",
        "SUM(reduce(totalTime = 0, n IN relationships(path)| totalTime + n.workFinished-n.workStarted)) as BookedTime, ",
        "SUM(reduce(totalPause = 0, n IN relationships(path)| totalPause + n.pause)) as BookedPause"
    ].join('\n');

    var params = {
        projectId: projectId
    };

    async.waterfall([

        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {

            if (!results || results.length === 0) {
                return callback(null, {
                    resourceCount: 0,
                    bookingsCount: 0,
                    bookedTime: 0,
                    bookedPause: 0
                });
            }

            var result = results[0];


            callback(null, {
                resourceCount: result.ResourceCount,
                bookingsCount: result.BookingsCount,
                bookedTime: result.BookedTime, // ms
                bookedPause: result.BookedPause //min
            });
        }
    ], retValCallback);
};


/**
 * ProjectRepository.prototype.resolveProjectBookings - Resolves bookings of given project
 *
 * @param  {type} projectId      description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectRepository.prototype.resolveProjectBookings = function(projectId, retValCallback) {
    var query = [
        "MATCH (u:User)-[]-()-[b:TIME_BOOKED]->(p:Project)",
        "WHERE id(p)={projectId}",
        "RETURN id(u) as userId, b as booking"
    ].join('\n');

    var params = {
        projectId: projectId
    };

    async.waterfall([

        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            var bookingList = [];
            _.each(results, function(result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, projectId, result.userId));
            });

            callback(null, bookingList);
        }
    ], retValCallback);
};


/**
 * ProjectRepository.prototype.resolveProjectResources - Resolves resources of given project
 *
 * @param  {type} projectId      description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectRepository.prototype.resolveProjectResources = function(projectId, retValCallback) {
    var query = [
        "MATCH (pers:Person)--(r:Role)--(p:Project)",
        "WHERE id(p)={projectId}",
        "RETURN id(pers) as personId, r as role, id(p) as projectId"
    ].join('\n');

    var params = {
        projectId: projectId
    };

    async.waterfall([

        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            var resourcesList = [];
            _.each(results, function(result) {

                var projectAssignment = {
                    personId: result.personId,
                    role: result.role.data.role,
                    roleSince: result.role.data.roleSince,
                    roleTill: result.role.data.roleTill,
                    projectId: result.projectId
                };

                resourcesList.push(projectAssignment);
            });

            callback(null, resourcesList);
        }
    ], retValCallback);
};


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
                projectList.push(new Project(project.project.id, project.project.data));
            });

            retValCallback(null, projectList);
        }
    ], retValCallback);
};


/**
 * Produces a new project according to the given projectData
 */
ProjectRepository.prototype.createNewProject = function(project, retValCallback) {
    var query = [
        "CREATE (project:Project{projectData})",
        "RETURN project"
    ].join('\n');

    var params = {
        projectData: project.data
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot create project with given properties.');
            }

            var createdProject = new Project(results[0].project.id, results[0].project.data);
            return callback(null, createdProject);
        }
    ], retValCallback);
};


/**
 * Saves given project by id with new data
 */
ProjectRepository.prototype.saveProject = function(projectId, project, retValCallback) {
    var query = [
        "MATCH (project:Project)",
        "WHERE id(project)={projectId}",
        "SET project = {projectData}",
        "RETURN project"
    ].join('\n');

    var params = {
        projectId: projectId,
        projectData: project.data
    };

    async.waterfall([
        function(callback) {
            db.query(query, params, callback);
        },
        function(results, callback) {
            if (results.length !== 1) {
                return retValCallback('Cannot save project with given properties.');
            }

            var createdProject = new Project(results[0].project.id, results[0].project.data);
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