var Project = require('./Project');
var _ = require('underscore');
var async = require('async');
var md5 = require('MD5');

var UserRepository = require('../model/UserRepository');
var userRepository = new UserRepository();

var PersonRepository = require('../model/PersonRepository');
var personRepository = new PersonRepository();

var User = require('../model/User');
var user = new User();

var Person = require('../model/Person');
var person = new Person();


var UserModel = function () {


    /**
     * Returns a new user object / array of object without password md5
     *
     * @param userObject object or array of objects
     */
    function secureUserPassword(userObject) {
        if (!userObject) {
            return userObject;
        }
        if (_.isArray(userObject)) {
            var retVal = [];
            _.each(userObject, function (user) {
                user.data.passwordMD5 = 'secure';
                retVal.push(instanciateUser(user.id, user.data, user.groups));
            });
            return retVal;
        } else {
            userObject.data.passwordMD5 = 'secure';
            return instanciateUser(userObject.id, userObject.data, userObject.groups);
        }
    }

    /**
     * Validates user data according to the logical constraints.
     *
     * @param project project object for validation
     * */
    function validateUser(user) {
        var retVal = [];
        if (!user.uid) {
            retVal.push('User must have a username');
        }

        if (!user.passwordMD5) {
            retVal.push('User must have a password');
        }

        return retVal.length > 0 ? retVal.join('\n') : null;

    }


    /**
     * Validates person data according to the logical constraints.
     *
     * @param project project object for validation
     * */
    function validatePerson(person) {
        var retVal = [];

        if (!person.forename) {
            retVal.push('Person must have a username');
        }

        if (!person.surname) {
            retVal.push('Person must have a surname');
        }

        if (!person.birthday) {
            retVal.push('Person must have a birthday');
        }

        if (!person.email) {
            retVal.push('Person must have a email');
        }

        if (!person.phone) {
            retVal.push('Person must have a phone');
        }

        return retVal.length > 0 ? retVal.join('\n') : null;

    }

    /**
     * Instanciates a new user instance
     * @param userData project data to be evaluated
     *
     * */
    function instanciateUser(userId, userData, userGroups) {

        userData = _.pick(userData, ['uid', 'passwordMD5', 'registrationDate', 'active']);
        var newUser = new User(userId, userData, userGroups);

        return newUser;
    }

    /**
     * Instanciates a new user instance
     * @param userData project data to be evaluated
     *
     * */
    function instanciatePerson(personId, personData) {


        personData = _.pick(personData, ['forename', 'surname', 'birthday', 'email', 'phone']);
        var person = new Person(personId, personData);

        return person;
    }

    var userModel = {

        /**
         * Finds user by given user id.
         * Password is not secured and may not be given to the client
         * Never use it for REST!
         * @param uid uid
         * @param callback
         */
        resolveUser: function (uid, callback) {
            if (!uid) {
                return callback('Cannot resolve user with uid null');
            }

            userRepository.resolveUser(uid, callback);

        },

        /**
         * Returns a list of persons in system
         * @param callback
         */
        listPersons: function (callback) {
            personRepository.listPersons(callback);
        },

        /**
         * Returns a list of all person roles exist in system
         * @param callback
         */
        listRoles: function (callback) {
            personRepository.listRoles(callback);
        },

        /**
         * Updates data of a existing person
         * @param personData
         * @param callback
         */
        updatePerson: function (personData, callback) {
            if (!personData) {
                return callback('Cannot update person with data null');
            }

            async.waterfall([function (callback) {
                personRepository.findPerson(personData.id, callback);
            }, function (person, callback) {
                personData = _.extend(person.data, personData);
                var personObject = instanciatePerson(personData.id, personData);
                callback(validateUser(personObject), personObject);
            }, function (personObject, callback) {
                personRepository.updatePerson(personObject, callback);
            }], callback);
        },


        /**
         * Returns a list of groups
         *
         * @param callback
         */
        listGroups: function (callback) {
            userRepository.listGroups(callback);
        },

        /**
         * Returns a list of all users with their groups and transitional personal data
         * @param callback
         */
        listUsers: function (callback) {
            userRepository.listUsers(function (err, users) {
                callback(err, secureUserPassword(users));
            });
        },

        /**
         * Updates user data like username (must be unique) and active fields. Password will be ignored
         * @param userData
         * @param callback
         */
        updateUser: function (userData, callback) {
            if (!userData) {
                return callback('Cannot update user with data null');
            }

            async.waterfall([function (callback) {
                userModel.resolveUser(userData.id, callback);
            }, function (user, callback) {
                userData = _.omit(userData, 'passwordMD5', 'registrationDate', 'groups');
                userData = _.extend(user.data, userData);
                var userObject = instanciateUser(userData.id, userData, user.groups);
                callback(validateUser(userObject), userObject);
            }, function (validatedUser, callback) {
                userRepository.updateUser(validatedUser, callback);
            }, function (updatedUser, callback) {
                callback(null, secureUserPassword(updatedUser));
            }], callback);

        },

        /**
         * Changes user password from old to the new one
         * @param passwordChangeData
         * @param callback
         */
        changeUserPassword: function (passwordChangeData, callback) {
            if (!passwordChangeData.username) {
                callback('Cannot change password,username is null');
            }
            if (!passwordChangeData.oldPassword || passwordChangeData.newPassword) {
                callback('Cannot change password, new or old password is null');
            }

            async.waterfall([function (callback) {
                userModel.resolveUser(passwordChangeData.username, callback);
            }, function (user, callback) {
                if (!user) {
                    return callback('User not found, cannot change password');
                }

                if (user.passwordMD5 !== md5(passwordChangeData.oldPassword)) {
                    return callback('Cannot change password- Old password is wrong');
                }

                var passwordMd5 = md5(passwordChangeData.newPassword);
                userRepository.changeUserPassword(passwordChangeData.username, passwordMd5, callback);
            }, function (result, callback) {
                if (result) {
                    return callback(null, true);
                }
            }], callback);
        },

        /**
         * Admin option to reset user password and reseted password back to admin
         *
         * @param userId userId
         * @param callback
         */
        resetUserPassword: function (userId, callback) {
            if (!userId) {
                callback('Cannot change password,username is null');
            }
            var resettedPassword = userId + '-' + Math.random();
            async.waterfall([function (callback) {
                userModel.resolveUser(userId, callback);
            }, function (user, callback) {
                if (!user) {
                    return callback('User not found, cannot change password');
                }

                var passwordMd5 = md5(resettedPassword);
                userRepository.changeUserPassword(userId, passwordMd5, callback);
            }, function (result, callback) {
                if (result) {
                    return callback(null, resettedPassword);
                }
            }], callback);
        },

        /**
         * Removes user from all groups and adds him to the given group
         * @param userId
         * @param groupId
         * @param callback
         */
        changeUserGroup: function (userId, groupId, callback) {
            if (!userId) {
                return callback('Cannot change group of user null');
            }

            if (!groupId) {
                return callback('Cannot change group null of user');
            }

            userRepository.assignUserGroup(userId, groupId, callback);
        },

        /**
         * Creates a new user and person data for it
         *
         * @param userData
         * @param callback
         */
        createUserWithPerson: function (username, password, givenData, callback) {
            if (!username) {
                return callback('Cannot create user without username');
            }

            if (!password) {
                return callback('Cannot create user without password');
            }

            if (!givenData) {
                return callback('Cannot create user without data');
            }

            // Security check. get only allowed Properties
            var personData = _.pick(givenData, 'forename', 'surname', 'birthday', 'email', 'phone');
            var person = instanciatePerson(null, personData);
            var userData = {
                uid: username,
                passwordMD5: md5(password),
                registrationDate: new Date().getTime(),
                active: true
            };
            var user = instanciateUser(null, userData, ['User']);

            async.waterfall([
                function (cb) {
                    cb(validateUser(user), user);
                },
                function (validatedUser, cb) {
                    cb(validatePerson(person), validatedUser, person);
                },
                function (validatedUser, validatedPerson, cb) {
                    userRepository.createUserWithPerson(validatedPerson, validatedUser, cb);
                },
                function (createdUser, callback) {
                    callback(null, secureUserPassword(createdUser));
                }
            ], callback);

        },


        /**
         * Finds a user by given username
         *
         * @param uid uid
         * @param callback
         */
        findUser: function (uid, callback) {
            if (!uid) {
                return callback('Cannot resolve user with uid null');
            }

            userRepository.findUser(uid, callback);
        }

    };

    return userModel;
};

module.exports = UserModel;