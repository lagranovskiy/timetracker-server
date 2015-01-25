/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
function Project(node) {

    return {

        /**
         * Returns the id from the database for this node.
         * @returns {Number}
         */
        get dbId() {
            return node.id;
        },

        /**
         * Returns the data object, a map of key-value pairs.
         * @returns {Object}
         */
        get data() {
            return node.data;
        }
    };
}

module.exports = Project;