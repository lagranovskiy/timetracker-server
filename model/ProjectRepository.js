var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    Project = require('./Project'),
    db = new neo4j.GraphDatabase(config.db.url);

function ProjectRepository() {}

/**
 * Lists all projects the person involved in and may book to
 *
 * @param {String}   forename forename of the person
 * @param {Function} callback Callback function
 */
ProjectRepository.prototype.listVisibleProjects = function (forename, retValCallback) {
    var query = [
    "MATCH (person:Person)-[r:IS_TEAM_MEMBER]->(project:Project)",
    "WHERE person.forename = {forename}",
    "RETURN project.projectName, r.role"
            ].join('\n');

    var parameters = {
        forename: forename
    };

    async.waterfall([

        function (callback) {
                db.query(query, parameters, callback)
        },
        function (results, callback) {
            retValCallback(null, results);
        }

    ])
}

module.exports = ProjectRepository;