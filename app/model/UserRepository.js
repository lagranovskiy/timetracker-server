var async = require('async'),
    User = require('./User'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function UserRepository() {}


UserRepository.prototype.createUserWithPerson = function(userData, retValCallback) {
    var query = [
            "MATCH (group:UserGroup{name:'User'})",
            "CREATE (user:User{uid:{uid},passwordMD5:{passwordMD5}, registrationDate:{registrationDate}})",
            "-[r:HAS_PROFILE]->",
            "(person:Person{forename:{forename}, surname:{surname}, birthday:{birthday}, email:{email}, phone:{phone}}),",
            "user-[:AUTHORIZED_AS]->(group)",
            "RETURN user, group.name as Group"
        ]
        .join('\n');

    async.waterfall([

        function(callback) {
            db.query(query, userData, callback);
        },
        function(results, callback) {
            if (results.length === 0) {
                return retValCallback(null, false);
            }
            if (results.length > 1) {
                return retValCallback('Illegal registration state.');
            }
            var groupArray = [];
            var result = results[0];
            groupArray.push(result.Group);

            var createdUser = new User(result.user.id, result.user.data, groupArray);

            return callback(null, createdUser);
        }
    ], retValCallback);
};


/**
 * Returns a single user according to the unique constraint.
 *
 * @param {String}   the uid of user to be returned
 * @param {Function} callback Callback function
 */
UserRepository.prototype.findUser = function(userId, retValCallback) {
    var query = [
            "MATCH (user:User{uid:{userId}})",
            "RETURN user"
        ]
        .join('\n');

    var parameters = {
        userId: userId
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
        },
        function(results, callback) {
            if (results.length === 0) {
                return retValCallback(null, false);
            }
            if (results.length > 1) {
                return retValCallback('Illegal authentication state.');
            }

            var result = results[0];

            return retValCallback(null, new User(result.user.id, result.user.data, []));
        }
    ]);
};


/**
 * Resolves used with its groups from db
 * That is a full resolving with groups etc.

 * @param {String}   userId         Userid for search
 * @param {Function} retValCallback callback function that will be called with user object as a result
 */
UserRepository.prototype.getUser = function(uid, retValCallback) {
    var query = [
            "MATCH (user:User{uid:{uid}})-[:AUTHORIZED_AS]->(group:UserGroup)",
            "OPTIONAL MATCH (relGroup)<-[:PART_OF*]-(group)",
            "RETURN user, group.name as MainGroup,collect( relGroup.name) as OtherGroups"
        ]
        .join('\n');

    var parameters = {
        uid: uid
    };

    async.waterfall([

        function(callback) {
            db.query(query, parameters, callback);
        },
        function(results, callback) {

            if (results.length === 0) {
                return retValCallback(null, false);
            }

            if (results.length > 1) {
                return retValCallback('Unique Constrained corrupted. More then one user found');
            }

            var result = results[0];
            var groupArray = [];
            groupArray.push(result.MainGroup);

            if (result.OtherGroups) {
                var i, otherGroups = result.OtherGroups.toString().split(',');

                for (i = 0; i < otherGroups.length; i++) {
                    groupArray.push(otherGroups[i]);
                }
            }

            var resolvedUser = new User(result.user.id, result.user.data, groupArray);
            return retValCallback(null, resolvedUser);
        }
    ]);
};

module.exports = UserRepository;