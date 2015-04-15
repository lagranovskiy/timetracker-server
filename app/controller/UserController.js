/**
 * User Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var UserModel = require('../model/UserModel');
var userModel = new UserModel();


/**
 * Check if username already exist.
 * Needed by ui to prevent double creation of users.
 *
 * @param request
 * @param response
 * @param next
 */
exports.checkUsernameExists = function (request, response, next) {
    var username = request.params.userId;
    console.info('Testing if user with id ' + userId + ' already exist.');

    if (!username) {
        next('Cannot find user with id null');
    }

    userModel.findUser(username, function (err, data) {
        if (err) {
            return response.status(500).send('error');
        }

        return response.status(200).send({
            userExist: (data)
        });
    });

};

/**
 * Returns a list of currently supported user groups
 *
 * @param request
 * @param response
 * @param next
 */
exports.listGroups = function (request, response, next) {
    console.info('Retrieving a list of current groups');

    userModel.listGroups(function (err, data) {
        if (err) {
            return next(err);
        }
        response.send(data);
    });
};

/**
 * Returns a list of users in system
 * List is not 1:1 usable for updating. Please checkout documentation.
 * Example {user:{}, person:{}}
 *
 * @param request
 * @param response
 * @param next
 */
exports.listUsers = function (request, response, next) {
    console.info('Retrieving a list of current users');

    async.waterfall([
            function (callback) {
                userModel.listUsers(callback);
            },
            function (userList, callback) {
                if (!userList) {
                    return callback('Cannot get user list');
                }
                var aggregatedUserList = [];
                async.eachSeries(userList, function (user, cb) {
                        userModel.resolveUserPerson(user, function (err, person) {
                            if (err) {
                                callback('Cannot resolve person profile of user ' + user.id);
                            }
                            aggregatedUserList.push({
                                user: user,
                                person: person
                            });

                            cb();
                        });
                    },
                    function (err) {
                        callback(err, aggregatedUserList);
                    });
            }
        ],
        function (err, aggregatedUserList) {
            if (err) {
                return next(err);
            }
            response.send(aggregatedUserList);
        });

};

/**
 * Updates user information that may be updated.
 *
 * @param request
 * @param response
 * @param next
 */
exports.updateUser = function (request, response, next) {
    console.info('Updating user');
    var userData = request.body;
    var uid = request.params.uid*1;

    if (!uid) {
        return next('Cannot update user. No userId found in request.');
    }
    if (!userData) {
        return next('Cannot update user. No userData found in request.');
    }

    if (userData.id !== uid) {
        return next('Cannot update user. No userData not match with given id.');
    }

    userModel.updateUser(userData.uid, userData, function (err, data) {
        if (err) {
            return next(err);
        }
        response.send(data);
    });

};

/**
 * Allow user to change his own password.
 * Change happens only if the old one is correct.
 * @param request
 * @param response
 * @param next
 */
exports.changeUserPassword = function (request, response, next) {
    console.info('Changing a password of user');
    var uid = request.params.uid;
    var passwordChangeData = request.body;
    //{oldPassword:"", newPassword:""}
    if (!passwordChangeData) {
        return next('Cannot change password. Data container is null');
    }
    if (!uid) {
        return next('Cannot change password. uid is null');
    }
    userModel.changeUserPassword(uid, passwordChangeData, function (err, success) {
        if (err) {
            return next(err);
        }
        response.send(success);
    });
};

/**
 * Resets user password. Only admin may do it. Now old password is needed.
 * A new password will be generated and returned.
 * userId is a UID here not a db id
 * @param request
 * @param response
 * @param next
 */
exports.resetUserPassword = function (request, response, next) {
    var uid = request.params.uid;
    console.info('Resetting a password of user ' + uid);

    if (!uid) {
        return next('Cannot reset password. uid null');
    }

    userModel.resetUserPassword(uid, function (err, resettedPassword) {
        if (err) {
            return next(err);
        }
        response.send(
            {
                resettedPassword: resettedPassword
            });
    });
};

/**
 * Removes user from all his groups and assigns him to a new one.
 * uid is NOT a db id
 * @param request
 * @param response
 * @param next
 */
exports.changeUserGroup = function (request, response, next) {
    console.info('Changing the group of user');

    var uid = request.params.uid; // like mmustermann
    var groupId = request.params.groupId*1;

    if (!uid) {
        return next('Cannot find user with uid null');
    }
    if (!groupId) {
        return next('Cannot find group with groupId null');
    }

    userModel.changeUserGroup(uid, groupId, function (err, result) {
        if (err) {
            return next(err);
        }
        response.send(result);
    });
};