/**
 * Person data entity
 ****/

var Person = function (dbPerson) {

    return {
        /**
         * Returns node id
         */
        getDbId: function () {
            return dbPerson.id;
        },

        /**
         * Returns original userdata object
         * @returns {[[Type]]} [[Description]]
         */
        getData: function () {
            return dbPerson.data;
        }

    };
};
module.exports = Person;