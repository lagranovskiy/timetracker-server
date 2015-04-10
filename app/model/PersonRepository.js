var async = require('async'),
    Person = require('./Person'),
    Project = require('./Project'),
    _ = require('underscore'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function PersonRepository() {}



/**
 * Resolves person item
 *
 * @param {String}   the uid of user to be returned
 * @param {Function} callback Callback function
 */
PersonRepository.prototype.findPerson = function (id, callback) {
    if (!id) {
        return callback('Cannot find user. Invalid args.');
    }

    async.waterfall([

        function (callback) {
            db.getNodeById(id, callback);
        },
        function (personNode, callback) {
            if (!personNode) {
                return callback('Cannot find person with given id');
            }

            return callback(null, new Person(personNode.id, personNode.data));
        }
    ], callback);
};



/**
 * Updates person to the given state
 * @param user
 * @param callback
 */
PersonRepository.prototype.updatePerson = function (person, callback) {
    if (!person) {
        return callback('Cannot update person. Invalid args.');
    }

    async.waterfall([function (callback) {
        db.getNodeById(person.id, callback);
    }, function (personNode, callback) {
        _.extend(personNode.data, person.data);
        personNode.save(callback);
    }], callback);
};


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