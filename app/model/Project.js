var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Project = function(projectId, projectData) {

    return extend(Project.super_(projectId, projectData), {

        /**
         * Returns the id from the database for this node.
         * @returns {String} project name
         */
        get projectName() {
            return projectData ? projectData.projectName : null;
        },

        get customerName() {
            return projectData ? projectData.customerName : null;
        },

        get description() {
            return projectData ? projectData.description : null;
        },

    });
};

util.inherits(Project, Entity);

module.exports = Project;