var async = require('async'),
    User = require('./User'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function UserRepository() {}


UserRepository.prototype.createUserWithPerson = function (userData, retValCallback) {
    var query = [
        "MATCH (group:UserGroup{name:'User'})",
        "CREATE (user:User{uid:{uid},passwordMD5:{passwordMD5}, registrationDate:{registrationDate}})",
        "-[r:HAS_PROFILE]->",
        "(person:Person{forename:{forename}, surname:{surname}, birthday:{birthday}, email:{email}, phone:{phone}}),",
        "user-[:AUTHORIZED_AS]->(group)",
        "RETURN user, group.name as Group"
     ].join('\n');

    async.waterfall([

        function (callback) {
            db.query(query, userData, callback)
        },
        function (results, callback) {
            if (results.length == 0) {
                retValCallback(null, false);
            }
            
            var createdUser = new User(results[0].user);
            createdUser.addGroup(results[0].Group)
            return callback(null, createdUser);
        }
    ], retValCallback)
};


/**
 * Lists all projects the person involved in and may book to
 *
 * @param {String}   forename forename of the person
 * @param {Function} callback Callback function
 */
UserRepository.prototype.findUser = function (userId, retValCallback) {
    var query = [
        "MATCH (user:User{uid:{userId}})",
        "RETURN user"
     ].join('\n');

    var parameters = {
        userId: userId
    };

    async.waterfall([

        function (callback) {
            db.query(query, parameters, callback)
        },
        function (results, callback) {
            if (results.length == 0) {
                return retValCallback(null, false);
            }
            if (results.length > 1) {
                return retValCallback('Illegal authentication state.');
            }

            return retValCallback(null, new User(results[0].user));
        }
    ])
};


/**
 * Resolves used with its groups from db
 * @param {String}   userId         Userid for search
 * @param {Function} retValCallback callback function that will be called with user object as a result
 */
UserRepository.prototype.getUser = function (uid, retValCallback) {
    var query = [
        "MATCH (user:User{uid:{uid}})-[:AUTHORIZED_AS]->(group:UserGroup)",
        "OPTIONAL MATCH (relGroup)<-[:PART_OF*]-(group)",
        "RETURN user, group.name as MainGroup,collect( relGroup.name) as OtherGroups"
    ].join('\n');

    var parameters = {
        uid: uid
    };

    async.waterfall([

        function (callback) {
            db.query(query, parameters, callback)
        },
        function (results, callback) {
            if (results.length == 0) {
                return retValCallback(null, false);
            }
            var authenticatedUser = new User(results[0].user);
            authenticatedUser.addGroup(results[0].MainGroup);

            if (results[0].OtherGroups) {
                var i, otherGroups = results[0].OtherGroups.toString().split(',');

                for (i = 0; i < otherGroups.length; i++) {
                    authenticatedUser.addGroup(otherGroups[i]);
                }
            }
            return retValCallback(null, authenticatedUser);
        }
    ])
};

module.exports = UserRepository;