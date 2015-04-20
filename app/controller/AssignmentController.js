/**
 * Created by lagranovskiy on 08.04.15.
 */
var async = require('neo-async');
var newrelic = require('newrelic');
var EventEmitter = require("events").EventEmitter;
var _ = require('underscore');
var ProjectAssignmentRepository = require('../model/ProjectAssignmentRepository');
var personAssignmentRepository = new ProjectAssignmentRepository();

var assignmentController = new EventEmitter();
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
assignmentController.updateAssignments = function (request, response, next) {
    console.info('Updating of assignments');

    var assignmentData = request.body;
    if (!assignmentData) {
        return next('Cannot process assignments null');
    }

    newrelic.recordMetric('Custom/Assignments/DispoActivity', assignmentData.length);

    // Prepare assignment call with only needed data
    async.map(assignmentData, function (assignment, callback) {

        if (!assignment.person.id) {
            return callback('Cannot associate person null with a project');
        }

        if (!assignment.project.id) {
            return callback('Cannot associate person  with a project null');
        }

        if (!assignment.role) {
            return callback('Cannot associate person with a project by role null');
        }
        personAssignmentRepository.updateAssignment(
            assignment.person.id,
            assignment.project.id,
            assignment.role,
            callback);

    }, function (err, data) {
        // if any of the file processing produced an error, err would equal that error
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A assignment failed to process');
            return next(err);
        } else {
            console.log('All assignments have been processed successfully');
            response.send("success");

            _.each(data, function (result) {
                assignmentController.emit("created", result);
            });

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
assignmentController.deleteAssignment = function (request, response, next) {
    console.info('Deleting of assignment.');
    newrelic.incrementMetric('Custom/Assignments/DeletedDisposition', 1);

    var assignmentId = request.params.assignmentId * 1;
    if (!assignmentId) {
        return next('Assignment id not set');
    }

    personAssignmentRepository.deleteAssignment(assignmentId, function (err, data) {
        if (err) {
            return next(err);
        }

        response.send(data);

        assignmentController.emit("deleted", data);
    });

};


module.exports = assignmentController;