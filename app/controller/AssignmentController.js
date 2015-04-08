/**
 * Created by lagranovskiy on 08.04.15.
 */
var async = require('async');
var _ = require('underscore');
var ProjectAssignmentRepository = require('../model/ProjectAssignmentRepository');
var personAssignmentRepository = new ProjectAssignmentRepository();


/**
 * Updates assignment data merges values
 *
 [{
        person: {},
        role: "",
        project: {}
    }]
 *
 *

 * @param request
 * @param response
 * @param next
 */
exports.updateAssignments = function (request, response, next) {
    console.info('Updating of assignments');

    var assignmentData = request.body;
    if (!assignmentData) {
        return next('Cannot process assignments null');
    }

    // Prepare assignment call with only needed data
    async.eachSeries(assignmentData, function (assignment, callback) {

        if(!assignment.person.id){
            callback('Cannot associate person null with a project');
        }

        if(!assignment.project.id){
            callback('Cannot associate person  with a project null');
        }

        if(!assignment.role){
            callback('Cannot associate person with a project by role null');
        }
        personAssignmentRepository.updateAssignment(
            assignment.person.id,
            assignment.project.id,
            assignment.role,
            callback);

    }, function (err) {
        // if any of the file processing produced an error, err would equal that error
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
            return next(err);
        } else {
            console.log('All files have been processed successfully');
            response.send("success");
        }
    });

};

/**
 * Deletes existing assignment
 *
 * @param request
 * @param response
 * @param next
 */
exports.deleteAssignment = function (request, response, next) {
    console.info('Deleting of assignment.');

    var assignmentId = request.params.assignmentId;
    if(!assignmentId){
        return next('Assignment id not set');
    }

    personAssignmentRepository.deleteAssignment(assignmentId, function (err, data) {
        if (err) {
            return next(err);
        }

        response.send(data);
    });

};