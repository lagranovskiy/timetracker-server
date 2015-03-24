var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Project = function(node) {

    return extend(Project.super_(node), {

        /**
         * Returns the id from the database for this node.
         * @returns {String} project name
         */
        get projectName() {
            return node.data.projectName;
        },

        get customerName() {
            return node.data.customerName;
        },

        get description() {
            return node.data.description;
        },

        get projectId() {
            return node.data.projectId;
        }

    });
};

util.inherits(Project, Entity);

module.exports = Project;