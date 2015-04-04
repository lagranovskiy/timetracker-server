var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Project = function(projectId, projectData) {

    var data = {};
    if (projectData) {
        extend(data, projectData);
    }

    return extend(Project.super_(projectId, projectData), {

        /**
         * Returns the id from the database for this node.
         * @returns {String} project name
         */
        get projectName() {
            return data.projectName;
        },


        /**
         * Customer name of the project
         */
        get customerName() {
            return data.customerName;
        },


        /**
         * Description of the project        
         */
        get description() {
            return data.description;
        },

    });
};

util.inherits(Project, Entity);

module.exports = Project;