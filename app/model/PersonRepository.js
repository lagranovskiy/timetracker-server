var async = require('async'),
    Person = require('./Person'),
    Project = require('./Project'),
    _ = require('underscore'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function PersonRepository() {}


/**
 * PersonRepository.prototype.listPersons -  Returns a list of all person objects saved in system
 *
 * @param  {type} retValCallback description
 * @return {type}                description
 */
PersonRepository.prototype.listPersons = function(retValCallback) {
    var query = [
            "MATCH (person:Person)",
            "RETURN person"
        ]
        .join('\n');

    async.waterfall([
        function(callback) {
            db.query(query, {}, callback);
        },
        function(results, callback) {
            var personList = [];
            _.each(results, function(result) {
                personList.push(new Person(result.person.id, result.person.data));
            });

            callback(null, personList);
        }
    ],retValCallback);
};


/**
 * Returns a array of all roles existing in system
 *
 * @param retValCallback
 */
PersonRepository.prototype.listRoles = function(retValCallback){
    var query = [
        "MATCH (role:Role)",
        "RETURN DISTINCT role.role as role"
    ]
        .join('\n');

    async.waterfall([
        function(callback) {
            db.query(query, {}, callback);
        }, function(results,callback){
            var roleList = [];
            _.each(results, function(result) {
                roleList.push(result.role);
            });

            callback(null, roleList);
        }
    ], retValCallback);
};


module.exports = PersonRepository;