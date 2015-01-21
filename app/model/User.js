/**
 * User entity
 ****/

var User = function (dbUser) {
    var groups = [];

    return {
        /**
         * Returns node id
         */
        getDbId: function () {
            return dbUser.id;
        },
        /**
         * returns UID
         * @returns {String} Userid of user
         */
        getUid: function () {
            return dbUser.data.uid;
        },

        /**
         * Returns password as a hash
         *
         * @returns {String} pwd hash
         */
        getPwdHash: function () {
            return dbUser.data.passwordMD5;
        },

        /**
         * Returns the list of usergroups
         *
         * @returns {Array} Returns array of groups
         */
        getGroups: function () {
            return groups;
        },

        /**
         * Adds a group to this user.
         * @param  String userGroup
         */
        addGroup: function (userGroup) {
            groups.push(userGroup);
        },

        /**
         * Returns original userdata object
         * @returns {[[Type]]} [[Description]]
         */
        getData: function () {
            return dbUser.data;
        }

    };
};
module.exports = User;