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
ProjectRepository.prototype.listVisibleProjects = function (uid, retValCallback) {
    var query = [
    "MATCH (user:User)-[]->(person:Person)-[r:IS_TEAM_MEMBER]->(project:Project)",
    "WHERE user.uid = {uid}",
    "RETURN project"
            ].join('\n');

    var parameters = {
        uid: uid
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

/**
 * Lists all projects in system
 * 
 * @param {Function} retValCallback return value callback
 */
ProjectRepository.prototype.listAllProjects = function (retValCallback) {
    var query = [
    "MATCH (project:Project)",
    "RETURN project"
            ].join('\n');

    async.waterfall([
       function (callback) {
                db.query(query, {}, callback)
        },
        function (results, callback) {
            retValCallback(null, results);
        }
    ])
}

module.exports = ProjectRepository;