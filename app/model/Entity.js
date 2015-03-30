/**
 * Represents a identifiable entity
 *
 * @param {Object} node Object as read from the database.
 * @returns {Tag}
 * @constructor
 */
function Entity(entitityId, entityData) {

    return {
        /**
         * Returns the id from the database for this node.
         * @returns {Number}
         */
        get id() {
            return entitityId;
        },

        /**
         * Returns the data object, a map of key-value pairs.
         * @returns {Object}
         */
        get data() {
            return entityData;
        }
    };
}

module.exports = Entity;