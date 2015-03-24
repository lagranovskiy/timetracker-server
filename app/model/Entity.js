/**
 * Represents a identifiable entity
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Entity(node) {

    return {
        /**
         * Returns the id from the database for this node.
         * @returns {Number}
         */
        get id() {
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

module.exports = Entity;