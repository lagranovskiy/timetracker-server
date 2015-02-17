/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Project = function(node) {

    return {

        /**
         * Returns the id from the database for this node.
         * @returns {Number}
         */
        getDbId: function() {
            return node.id;
        },


        /**
         * Returns the id from the database for this node.
         * @returns {String} project name
         */
        getProjectName: function() {
            return node.data.projectName;
        },

        /**
         * Returns the data object, a map of key-value pairs.
         * @returns {Object}
         */
        getData: function() {
            return node.data;
        }
    };
};

module.exports = Project;