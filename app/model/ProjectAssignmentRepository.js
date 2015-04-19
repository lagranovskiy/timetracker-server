var async = require('neo-async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Project = require('./Project'),
    db = new neo4j.GraphDatabase(config.db.url);


function ProjectAssignmentRepository() {
}


/**
 * Lists all projects the person involved in and may book to
 *
 * @param {String}   uid forename of the person
 * @param {Function} callback Callback function
 */
ProjectAssignmentRepository.prototype.listProjectsOfPerson = function (userDbId, retValCallback) {
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[r1:HAS_ROLE]->()-[r2:ON_PROJECT]->(project:Project)",
        "WHERE id(user) = {userDbId}",
        "AND not has (project.deleted)",
        "RETURN project"
    ]
        .join('\n');

    var parameters = {
        userDbId: userDbId
    };

    async.waterfall([

        function (callback) {
            db.query(query, parameters, callback);
        },
        function (results, callback) {
            var projectList = [];
            _.each(results, function (project) {
                projectList.push(new Project(project.project.id, project.project.data));
            });

            retValCallback(null, projectList);
        }
    ]);
};


ProjectAssignmentRepository.prototype.updateAssignment = function (personId, projectId, role, retValCallback) {
    var query = [
        "MATCH (person:Person),(project:Project)",
        "WHERE id(person)={personId} and id(project)={projectId}",
        "MERGE (r:Role{role:{role}})-[:ON_PROJECT]->(project)",
        "MERGE (person)-[hr:HAS_ROLE]->(r)",
        "ON CREATE SET hr.created=timestamp()",
        "RETURN person,r, project"
    ]
        .join('\n');

    var parameters = {
        personId: personId,
        projectId: projectId,
        role: role
    };

    async.waterfall([

        function (callback) {
            db.query(query, parameters, callback);
        },
        function (results, callback) {
            callback(null, {
                assignmentId: results[0].r.id,
                personId: results[0].person.id,
                projectId: results[0].project.id,
                role: results[0].r.role
            });
        }
    ], retValCallback);
};


/**
 * ProjectRepository.prototype.removePersonProjectRole - description
 * @param  {type} roleUid        description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectAssignmentRepository.prototype.deleteAssignment = function (assignmentUid, retValCallback) {
   var personId = null;

    async.waterfall([
        function (callback) {
            db.getRelationshipById(assignmentUid, callback);
        },
        function (result, callback) {
            if (result) {
                personId = result.person.id;
                result.del(callback);
            } else {
                callback('Cannot find');
            }
        }
    ], function (err, data) {
        retValCallback(err, {
            assignmentId: assignmentUid,
            personId: personId
        });
    });
};

module.exports = ProjectAssignmentRepository;