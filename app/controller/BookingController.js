/**
 * Bookings Controller
 *
 * Controlls booking services
 *
 **/
var async = require('neo-async');
var newrelic = require('newrelic');
var _ = require('underscore');
var EventEmitter = require("events").EventEmitter;
var Booking = require('../model/Booking');
var BookingModel = require('../model/BookingModel');
var bookingModel = new BookingModel();

var controller = new EventEmitter();
/**
 * Lists all bookings the current authenticated user ever made
 *
 * Emits events:
 *  - created
 *  - updated
 *  - deleted
 *
 * TODO: Implement limit functionality
 */
controller.listUserBookings = function (request, response, next) {
    var userId = request.user.id * 1;
    console.info('Listing of all bookings of user with id' + userId);

    bookingModel.listAllUserBookings(userId, function (err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};

/**
 * Returns bookings of user with given userId
 * @param request
 * @param response
 * @param next
 */
controller.listUserBookingsById = function (request, response, next) {
    var userId = request.params.userId * 1;
    console.info('Listing of all bookings of user with id' + userId);

    bookingModel.listAllUserBookings(userId, function (err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

/**
 * Lists all bookings user made for given project
 */
controller.listUserProjectBookings = function (request, response, next) {
    var userId = request.user.id * 1;
    var projectId = request.params.projectId * 1;
    if (!projectId) {
        next('Cannot resolve project bookings. No project ID transfered.');
    }
    projectId = projectId * 1;
    console.info('Listing of all bookings by given project ' + projectId + ' of user with id ' + userId);


    bookingModel.listUserProjectBookings(userId, projectId, function (err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


/**
 * List all bookings ever made
 * Expects query and start parameter to be set or take defaults
 */
controller.listBookings = function (request, response, next) {
    console.info('Listing of all bookings');
    var start = request.query.start ? request.query.start * 1 : 0;
    var limit = request.query.limit ? request.query.limit * 1 : 10;

    bookingModel.listAllBookings(start, limit, function (err, results) {
        if (err) {
            return next(err);
        }
        response.send(results);
    });
};

/**
 * Create a new booking
 */
controller.createBooking = function (request, response, next) {
    var userId = request.user.id * 1;

    console.info('Creating of a new booking for user ' + userId);

    var bookingData = request.body;
    bookingData.userId = userId;

    bookingModel.createNewBooking(bookingData, function (err, createdBooking) {
        if (err) {
            return next(err);
        }
        newrelic.incrementMetric('Custom/Booking/BookingCreated', 1);
        response.send(createdBooking);
        controller.emit("created", {
            bookingId: createdBooking.id,
            projectId: createdBooking.projectId,
            userId: createdBooking.userId
        });
    });


};

/**
 * Updates existing booking
 */
controller.saveBooking = function (request, response, next) {
    var userId = request.user.id * 1;
    var bookingId = request.params.bookingId * 1;
    var bookingData = request.body;

    console.info('Updating of a existing booking with id ' + bookingId + 'for user ' + userId);

    if (!bookingId) {
        return next('Cannot save booking. No bookingId found in request.');
    }

    if (userId !== bookingData.userId) {
        return next('Updating of booking is allowed only for the owner of the booking.');
    }

    bookingModel.updateBooking(bookingData, function (err, updatedBooking) {
        if (err) {
            return next(err);
        }

        response.send(updatedBooking);
        controller.emit("updated", {
            bookingId: updatedBooking.id,
            projectId: updatedBooking.projectId,
            userId: updatedBooking.userId
        });
    });


};

/**
 * Deletes booking from db
 */
controller.deleteBooking = function (request, response, next) {
    var userId = request.user.id * 1;
    var bookingId = request.params.bookingId * 1;

    console.info('Deliting of a existing booking with id ' + bookingId + ' for user ' + userId);

    if (!bookingId) {
        return next('Cannot delete booking. No bookingId found in request.');
    }
    bookingId = bookingId * 1; // Convert bookingId to number
    userId = userId * 1; // Convert bookingId to number

    bookingModel.deleteBooking(bookingId, userId, function (err, result) {
        if (err) {
            return next(err);
        }
        newrelic.incrementMetric('Custom/Booking/BookingRemoved', 1);
        response.send(result);
        controller.emit("deleted", {
            bookingId: result.id,
            projectId: result.projectId,
            userId: result.userId
        });
    });
};

module.exports = controller;