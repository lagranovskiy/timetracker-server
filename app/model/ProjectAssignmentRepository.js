var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Project = require('./Project'),
    db = new neo4j.GraphDatabase(config.db.url);


function ProjectAssignmentRepository() {}



/**
 * Lists all projects the person involved in and may book to
 *
 * @param {String}   uid forename of the person
 * @param {Function} callback Callback function
 */
ProjectAssignmentRepository.prototype.listProjectsOfPerson = function(userDbId, retValCallback) {
    var query = [
            "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[r1:HAS_ROLE]->()-[r2:ON_PROJECT]->(project:Project)",
            "WHERE id(user) = {userDbId}",
            "RETURN project"
        ]
        .join('\n');

    var parameters = {
        userDbId: userDbId
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
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


ProjectAssignmentRepository.prototype.createPersonProjectRole = function(personUid, projectUid, projectRole, retValCallback) {
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
 * @param  {type} roleUid        description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectAssignmentRepository.prototype.removePersonProjectRole = function(roleUid, retValCallback) {
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

module.exports = ProjectAssignmentRepository;