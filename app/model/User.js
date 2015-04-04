var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

/**
 * User entity
 ****/

var User = function(userId, userData, userGroups) {

    var data = {};
    if (userData) {
        extend(data, userData);
    }

    var groups = [];
    if (userGroups) {
        groups = userGroups;
    }

    return extend(User.super_(userId, userData), {

        /**
         * returns UID
         * @returns {String} Userid of user
         */
        get uid() {
            return data.uid;
        },

        /**
         * Returns password as a hash
         *
         * @returns {String} pwd hash
         */
        get pwdHash() {
            return data.passwordMD5;
        },


        /**
         * Returns the registration date of the user
         */
        get registrationDate() {
            return data.registrationDate;
        },

        /**
         * Returns the list of usergroups
         *
         * @returns {Array} Returns array of groups
         */
        get groups() {
            return groups;
        }

    });
};

util.inherits(User, Entity);

module.exports = User;