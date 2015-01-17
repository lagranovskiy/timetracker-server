var async = require('async'),
    User = require('./User'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function UserRepository() {};

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
                retValCallback('User not found.');
            }
            if (results.length > 1) {
                retValCallback('Illegal authentication state.');
            }

            retValCallback(null, new User(results[0].user));
        }
    ])
}



UserRepository.prototype.getUserWithGroups =function(userId, retValCallback) {
    var query = [
        "MATCH (user:User{uid:'aschmidt'})-[:AUTHORIZED_AS]->(group:UserGroup)",
        "OPTIONAL MATCH (relGroup)<-[:PART_OF*]-(group)",
        "RETURN user, group.name as Group,collect( relGroup.name) as OtherGroups"
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
                retValCallback('User not found.');
            }

            var groupsArray = [];
            groupsArray.push(results[0].Group);
            var i, otherGroups = results[0].OtherGroups.split(',');
            
            for (i = 0; i < otherGroups.length; i++) {
                groupsArray.push(otherGroups[i]);
            }
            groupsArray.push(results[0].OtherGroups.split(','));





            retValCallback(null, {
                user: new User(results[0].user),
                groups: groupsArray
            });
        }
    ])
}

module.exports = UserRepository;