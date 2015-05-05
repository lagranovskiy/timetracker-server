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
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[r1:HAS_ROLE]->(role:Role)-[r2:ON_PROJECT]->(project:Project)",
        "WHERE id(user) = {userDbId}",
        "AND not has (project.deleted)",
        "RETURN project, role"
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
            _.each(results, function (data) {

                var project = new Project(data.project.id, data.project.data);
                project.role = data.role.data.role;
                projectList.push(project);
            });

            retValCallback(null, projectList);
        }
    ]);
};


ProjectAssignmentRepository.prototype.updateAssignment = function (personId, projectId, role, retValCallback) {
    if (!personId) {
        return retValCallback('Cannot update assignment with person id null');
    }

    if (!projectId) {
        return retValCallback('Cannot update assignment with projectId null');
    }

    if (!role) {
        return retValCallback('Cannot update assignment with role null');
    }
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
                role: results[0].r.data.role
            });
        }
    ], function (err, data) {
        retValCallback(err, data);
    });
};


/**
 * ProjectRepository.prototype.removePersonProjectRole - description
 * @param  {type} assignmentId        id of assignment to be removed
 * @param  {type} retValCallback description
 * @return {type}                description
 */
ProjectAssignmentRepository.prototype.deleteAssignment = function (assignmentId, retValCallback) {
    if (!assignmentId) {
        return retValCallback('Cannot update assignment with assignmentId null');
    }

    var query = [
        'MATCH (person:Person)-[assignment]-(r:Role)-[]-(project:Project)',
        'WHERE id(assignment)={assignmentId}',
        'DELETE assignment',
        'RETURN person, project'
    ].join('\n');

    var param = {
        assignmentId: assignmentId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            if (!results || results.length !== 1) {
                return callback('Cannot unassign users');
            }

            var data = results[0];

            callback(null, {
                assignmentId: assignmentId,
                projectId: data.project.id,
                personId: data.person.id
            });
        }
    ], retValCallback);


};

module.exports = ProjectAssignmentRepository;