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
        {
          id: null,
          projectId: null,
          projectName: null,
          customerName: null,
          projectType: null,
          projectStart: new Date(2015, 5, 1, 0, 0, 0).getTime(),
          projectEnd: new Date(2016, 5, 1, 0, 0, 0).getTime(),
          projectResponsible: null,
          description: null,
          createdTime: new Date().getTime(),
          lastUpdatedTime: new Date().getTime()
        };
        */

        /**
         * The id of project
         */
        get projectId() {
            return data.projectId;
        },


        /**
         * Returns the id from the database for this node.
         * @returns {String} project name
         */
        get projectName() {
            return data.projectName;
        },


        /**
         * Description of the project
         */
        get description() {
            return data.description;
        },

        /**
         * Customer name of the project
         */
        get customerName() {
            return data.customerName;
        },



        /**
         * The type of the project (tm/fixprice)
         */
        get projectType() {
            return data.projectType;
        },


        /**
         * Date project started
         */
        get projectStart() {
            return data.projectStart;
        },


        /**
         * Date project ended
         */
        get projectEnd() {
            return data.projectEnd;
        },


        /**
         * Name the project manager
         * TODO: add relation project manager
         */
        get projectResponsible() {
            return data.projectResponsible;
        },


        /**
         * Time project created
         */
        get createdTime() {
            return data.createdTime;
        },


        /**
         * Time project was last updated
         */
        get lastUpdatedTime() {
            return data.lastUpdatedTime;
        }


    });
};

util.inherits(Project, Entity);

module.exports = Project;