var _ = require('underscore');
var async = require('neo-async'),
    User = require('./User'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function UserRepository() {
}

/**
 * Returns a list of user (resolved)
 *
 * @param {String}   the uid of user to be returned
 * @param {Function} callback Callback function
 */
UserRepository.prototype.listUsers = function (callback) {

    var query = [
        "MATCH (user:User)-[:AUTHORIZED_AS]->(group:UserGroup)",
        "OPTIONAL MATCH (relGroup)<-[:PART_OF*]-(group)",
        "RETURN user, group.name as MainGroup,collect( relGroup.name) as OtherGroups"
    ].join('\n');


    async.waterfall([

        function (callback) {
            db.query(query, {}, callback);
        },
        function (results, callback) {
            var userList = [];
            _.each(results, function (result) {
                var groupArray = [];
                groupArray.push(result.MainGroup);

                if (result.OtherGroups && result.OtherGroups.length>0) {
                    var i, otherGroups = result.OtherGroups.toString().split(',');

                    for (i = 0; i < otherGroups.length; i++) {
                        groupArray.push(otherGroups[i]);
                    }
                }

                userList.push(new User(result.user.id, result.user.data, groupArray));

            });
            return callback(null, userList);
        }
    ], callback);
};
/**
 * Updates user to the given state
 * @param user
 * @param callback
 */
UserRepository.prototype.updateUser = function (user, callback) {
    if (!user) {
        return callback('Cannot update user. Invalid args.');
    }

    async.waterfall([function (callback) {
        db.getNodeById(user.id, callback);
    }, function (userNode, callback) {
        _.extend(userNode.data, user.data);
        userNode.save(callback);
    }], callback);
};

/**
 * Assign user to a given group
 * @param userId
 * @param groupId
 * @param callback
 */
UserRepository.prototype.assignUserGroup = function (userId, groupId, callback) {
    if (!userId || !groupId) {
        return callback('Cannot process group assignment. Invalid args.');
    }
    var user = null;
    async.waterfall([function (callback) {
        db.getNodeById(userId, callback);
    }, function (userNode, callback) {
        user = userNode;
        userNode.getRelationships('AUTHORIZED_AS', callback);
    }, function (relationshipList, callback) {
        async.each(relationshipList, function (relationship, cb) {
                relationship.del(cb);
            },
            function (err) {
                callback(err, true);
            });
    }, function (removed, callback) {
        if (!removed) {
            return callback('Removing of user groups was not seceded');
        }

        db.getNodeById(groupId, callback);
    }, function (groupNode, callback) {
        if (!groupNode) {
            return callback('Cannot find node with given id');
        }
        user.createRelationshipTo(groupNode, 'AUTHORIZED_AS', {}, callback);

    }, function (relation, callback) {
        if (!relation) {
            return callback('Creating of user group relation not possible');
        }
        callback(null, true);
    }], callback);
};

/**
 * Changes user password
 * @param uid
 * @param newPassword
 * @param callback
 */
UserRepository.prototype.changeUserPassword = function (uid, newPassword, callback) {
    if (!uid || !newPassword) {
        return callback('Cannot process password change. Invalid args.');
    }
    async.waterfall([function (callback) {
        UserRepository.prototype.findUser(uid, callback);
    }, function (foundUser, callback) {
        if (!foundUser) {
            return callback('Cannot find user');
        }

        db.getNodeById(foundUser.id, callback);

    }, function (foundNode, callback) {
        foundNode.data.passwordMD5 = newPassword;
        foundNode.save(function (err, data) {
            callback(err, true);
        });
    }], callback);
};
/**
 * Returns list of all groups existings in system
 * @param callback
 */
UserRepository.prototype.listGroups = function (callback) {
    var query = [
        "MATCH (group:UserGroup)",
        "RETURN group"
    ]
        .join('\n');

    async.waterfall([
        function (callback) {
            db.query(query, {}, callback);
        },
        function (groups, callback) {
            var groupList = [];
            _.each(groups, function (group) {
                groupList.push({
                    id: group.group.id,
                    name: group.group.data.name,
                    description: group.group.data.description
                });
            });
            callback(null, groupList);
        }
    ], callback);
};
/**
 * Creates a new user and person
 * @param userData
 * @param retValCallback
 */
UserRepository.prototype.createUserWithPerson = function (person, user, callback) {
    if (!person || !user) {
        return callback('Cannot create user and person. Invalid args.');
    }
    var query = [
        "MATCH (group:UserGroup{name:'User'})",
        "CREATE (user:User{uid:{uid},passwordMD5:{passwordMD5}, registrationDate:{registrationDate}})",
        "-[r:HAS_PROFILE]->",
        "(person:Person{forename:{forename}, surname:{surname}, birthday:{birthday}, email:{email}, phone:{phone}}),",
        "user-[:AUTHORIZED_AS]->(group)",
        "RETURN user, group.name as Group"
    ].join('\n');

    var params = _.extend(person.data, user.data);
    async.waterfall([

        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {
            if (results.length === 0) {
                return callback(null, false);
            }
            if (results.length > 1) {
                return callback('Illegal registration state.');
            }
            var groupArray = [];
            var result = results[0];
            groupArray.push(result.Group);

            var createdUser = new User(result.user.id, result.user.data, groupArray);

            return callback(null, createdUser);
        }
    ], callback);
};


/**
 * Returns a single user according to the unique constraint.
 *
 * @param {String}   the uid of user to be returned
 * @param {Function} callback Callback function
 */
UserRepository.prototype.findUser = function (uid, callback) {
    if (!uid) {
        return callback('Cannot find user. Invalid args.');
    }
    var query = [
        "MATCH (user:User{uid:{uid}})",
        "RETURN user"
    ]
        .join('\n');

    var parameters = {
        uid: uid
    };

    async.waterfall([

        function (callback) {
            db.query(query, parameters, callback);
        },
        function (results, callback) {
            if (results.length === 0) {
                return callback(null, false);
            }
            if (results.length > 1) {
                return callback('Illegal authentication state.');
            }

            var result = results[0];

            return callback(null, new User(result.user.id, result.user.data, []));
        }
    ], callback);
};


/**
 * Resolves used with its groups from db
 * That is a full resolving with groups etc.

 * @param {String}   userId         Userid for search
 * @param {Function} retValCallback callback function that will be called with user object as a result
 */
UserRepository.prototype.resolveUser = function (uid, callback) {
    if (!uid) {
        return callback('Cannot resolve user. Invalid args.');
    }
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

        function (callback) {
            db.query(query, parameters, callback);
        },
        function (results, callback) {

            if (results.length === 0) {
                return callback(null, false);
            }

            if (results.length > 1) {
                return callback('Unique Constrained corrupted. More then one user found');
            }

            var result = results[0];
            var groupArray = [];
            if (result.MainGroup && result.MainGroup.length > 0) {
                groupArray.push(result.MainGroup);
            }
            if (result.OtherGroups) {
                var i, otherGroups = result.OtherGroups.toString().split(',');

                for (i = 0; i < otherGroups.length; i++) {
                    if (otherGroups[i].length > 0) {
                        groupArray.push(otherGroups[i]);
                    }

                }
            }

            var resolvedUser = new User(result.user.id, result.user.data, groupArray);
            return callback(null, resolvedUser);
        }
    ], callback);
};

module.exports = UserRepository;