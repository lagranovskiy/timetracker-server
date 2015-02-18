var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Project = require('./Project'),
    db = new neo4j.GraphDatabase(config.db.url);

function ProjectRepository() {}


/**
 * Lists all projects the person involved in and may book to
 *
 * @param {String}   uid forename of the person
 * @param {Function} callback Callback function
 */
ProjectRepository.prototype.listProjectsOfPerson = function(personUid, retValCallback) {
    var query = [
            "MATCH (person:Person)-[r1:HAS_ROLE]->()-[r2:ON_PROJECT]->(project:Project)",
            "WHERE person.uid = {personUid}",
            "RETURN project"
        ]
        .join('\n');

    var parameters = {
        personUid: personUid
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
        },
        function(results, callback) {
            var projectList = [];
            _.each(results, function(project) {
                projectList.push(new Project(project));
            });

            retValCallback(null, projectList);
        }
    ]);
};


/**
 * Adds given person to the given project in given role if not already happen
 * TODO: Move it to the RoleRepository
 */
ProjectRepository.prototype.createPersonProjectRole = function(personUid, projectUid, projectRole, retValCallback) {
    var query = [
            "MATCH (person:Person),(project:Project)",
            "WHERE id(person)={personUid} and id(project)={projectUid}",
            "MERGE (person)-[:HAS_ROLE]->(r:Role{role:{projectRole}})-[:ON_PROJECT]->(project)",
            "ON CREATE SET r.created=timestamp()",
            "RETURN person,r, project"
        ]
        .join('\n');

    var parameters = {
        personUid: personUid,
        projectUid: projectUid,
        projectRole: projectRole
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
        },
        function(results, callback) {
            // TODO: Implement
            var projectList = [];
            _.each(results, function(project) {
                projectList.push(new Project(project));
            });

            retValCallback(null, projectList);
        }
    ]);
};


/**
 * ProjectRepository.prototype.removePersonProjectRole - description
 *  TODO: Move it to the RoleRepository
 * @param  {type} roleUid        description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectRepository.prototype.removePersonProjectRole = function(roleUid, retValCallback) {
    var query = [
            "MATCH (role:Role)-[rel]-()",
            "WHERE id(role)={roleUid}",
            "DELETE role,rel"
        ]
        .join('\n');

    var parameters = {
        roleUid: roleUid
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
        },
        function(results, callback) {
            // TODO: Implement
            var projectList = [];
            _.each(results, function(project) {
                projectList.push(new Project(project));
            });

            retValCallback(null, projectList);
        }
    ]);
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
                projectList.push(new Project(project));
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