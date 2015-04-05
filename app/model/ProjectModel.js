var Project = require('./Project');
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var ProjectRepository = require('../model/ProjectRepository');
var projectRepository = new ProjectRepository();

var ProjectAssignmentRepository = require('../model/ProjectAssignmentRepository');
var projectAssignmentRepository = new ProjectAssignmentRepository();

var ProjectModel = function() {

    /**
     * Validates project according to the logical constraints.
     *
     * @param project project object for validation
     * */
    function validateProject(project) {
        var retVal = [];
        if (!project) {
            retVal.push('No Project given');
        }

        if (!project.projectId) {
            retVal.push('Project mus have an identifier');
        }

        if (!project.customerName) {
            retVal.push('Project mus have an customerName');
        }

        if (!project.projectStart) {
            retVal.push('Project start may not be empty');

        }
        if (!project.projectEnd) {
            retVal.push('Project end field may not be empty');
        }

        if (project.projectStart >= project.projectEnd) {
            retVal.push('Cannot create project. Project end is equal or less then project start.');
        }

        if (!project.projectResponsible) {
            retVal.push('Project responsible may not be empty');
        }

        return retVal.length > 0 ? retVal.join('\n') : null;

    }


    /**
     * Instanciates a new project instance
     * @param bookingData project data to be evaluated
     *
     * */
    function instanciateProject(projectData) {

        var projectId = projectData.id;

        projectData = _.pick(projectData, ['projectId', 'projectName', 'customerName', 'projectType', 'projectStart', 'projectEnd', 'projectResponsible', 'description', 'createdTime', 'lastUpdatedTime']);
        var newProject = new Project(projectId, projectData);

        return newProject;
    }

    var projectModel = {


        /**
         * listVisibleProjects - Returns a list of user visible projects
         *
         * @param  {type} userId   description
         * @param  {type} callback description
         * @return {type}          description
         */
        listVisibleProjects: function(userId, callback) {
            if (!userId) {
                return callback('Cannot get visible projects of user null');
            }

            projectAssignmentRepository.listProjectsOfPerson(userId, function(err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },


        /**
         * listProjects - List all saved projects
         *
         * @param  {type} callback description
         * @return {type}          description
         */
        listProjects: function(callback) {
            projectRepository.listAllProjects(function(err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },


        /**
         * projectStatistic - Returns project stats
         *
         * @param  {type} projectId description
         * @param  {type} callback  description
         * @return {type}           description
         */
        projectStatistic: function(projectId, callback) {

            if (!projectId) {
                return callback('Cannot resolve project statistics. No projectId found in request.');
            }

            projectRepository.resolveProjectStatistics(projectId, function(err, statistic) {
                if (err) {
                    return callback(err);
                }

                callback(null, statistic);
            });
        },


        /**
         * projectResources - Returns project resources
         *
         * @param  {type} projectId description
         * @param  {type} callback  description
         * @return {type}           description
         */
        projectResources: function(projectId, callback) {
            if (!projectId) {
                return callback('Cannot resolve project resources. No projectId found in request.');
            }

            projectRepository.resolveProjectResources(projectId, function(err, resources) {
                if (err) {
                    return callback(err);
                }

                callback(null, resources);
            });
        },



        /**
         * projectBookings - Returns project bookings
         *
         * @param  {type} projectId description
         * @param  {type} callback  description
         * @return {type}           description
         */
        projectBookings: function(projectId, callback) {
            if (!projectId) {
                return callback('Cannot resolve project bookings. No projectId found in request.');
            }

            projectRepository.resolveProjectBookings(projectId, function(err, bookings) {
                if (err) {
                    return callback(err);
                }

                callback(null, bookings);
            });

        },


        /**
         * createNewProject - Creates a new project
         *
         * @param  {type} projectData description
         * @param  {type} callback    description
         * @return {type}             description
         */
        createNewProject: function(projectData, callback) {
            if (!projectData) {
                return callback('No Project data given');
            }

            if (projectData.id) {
                return callback('Cannot create project that already has ID. Please use update method instead.');
            }
            var newProject = instanciateProject(projectData);

            async.waterfall([
                function(cb) {
                    cb(validateProject(newProject), newProject);
                },
                function(validatedProject, cb) {
                    projectRepository.createNewProject(newProject, cb);
                }
            ], callback);

        },


        /**
         * saveProject - Updates existing project        
         *
         * @param  {type} projectId   description
         * @param  {type} projectData description
         * @param  {type} callback    description
         * @return {type}             description
         */

        saveProject: function(projectId, projectData, callback) {
            if (!projectData) {
                return callback('No project data given');
            }

            if (!projectId) {
                return callback('Cannot update nonpersistent project');
            }

            var existingProject = instanciateProject(projectData);

            async.waterfall([
                function(cb) {
                    cb(validateProject(existingProject), existingProject);
                },
                function(newProject, cb) {
                    projectRepository.saveProject(newProject.id, newProject, cb);

                }
            ], callback);

        },

        /**
         * Removes project by id
         * */
        deleteBooking: function(projectId, callback) {
            if (!projectId) {
                return callback('Missing mandatory information for project removal');
            }

            var bookingInstance = instanciateProject({
                id: projectId
            });

            projectRepository.deleteProject(projectId, function(err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        }

    };

    return projectModel;
};

module.exports = ProjectModel;