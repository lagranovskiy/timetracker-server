/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var Booking = require('../model/Booking');
var BookingModel = require('../model/BookingModel');
var bookingModel = new BookingModel();

/**
 * Lists all bookings the current authenticated user ever made
 * TODO: Implement limit functionality
 */
exports.listUserBookings = function(request, response, next) {
    var userId = request.user.id;
    console.info('Listing of all bookings of user with id' + userId);


    bookingModel.listAllUserBookings(userId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

/**
 * Lists all bookings user made for given project
 */
exports.listUserProjectBookings = function(request, response, next) {
    var userId = request.user.id;
    var projectId = request.params.projectId;
    if (!projectId) {
        next('Cannot resolve project bookings. No project ID transfered.');
    }
    projectId = projectId * 1;
    console.info('Listing of all bookings by given project ' + projectId + ' of user with id ' + userId);


    bookingModel.listUserProjectBookings(userId, projectId, function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};


/**
 * List all bookings ever made
 * TODO: IMplement limit functionality
 */
exports.listBookings = function(request, response, next) {
    console.info('Listing of all bookings');

    bookingModel.listAllBookings(function(err, results) {
        if (err) {
            return next(err);
        }

        response.send(results);
    });
};

/**
 * Create a new booking
 */
exports.createBooking = function(request, response, next) {
    var userId = request.user.id;

    console.info('Creating of a new booking for user ' + userId);

    var bookingData = request.body;
    bookingData.userId = userId;

    bookingModel.createNewBooking(bookingData, function(err, createdBooking) {
        if (err) {
            return next(err);
        }

        response.send(createdBooking);
    });


};

/**
 * Updates existing booking
 */
exports.saveBooking = function(request, response, next) {
    var userId = request.user.id;
    var bookingId = request.params.bookingId;
    var bookingData = request.body;

    console.info('Updating of a existing booking with id ' + bookingId + 'for user ' + userId);

    if (!bookingId) {
        return next('Cannot save booking. No bookingId found in request.');
    }

    if (userId !== bookingData.userId) {
        return next('Updating of booking is allowed only for the owner of the booking.');
    }

    bookingModel.updateBooking(bookingData, function(err, createdBooking) {
        if (err) {
            return next(err);
        }

        response.send(createdBooking);
    });



};

/**
 * Deletes booking from db
 */
exports.deleteBooking = function(request, response, next) {
    var userId = request.user.id;
    var bookingId = request.params.bookingId;

    console.info('Deliting of a existing booking with id ' + bookingId + ' for user ' + userId);

    if (!bookingId) {
        return next('Cannot delete booking. No bookingId found in request.');
    }
    bookingId = bookingId * 1; // Convert bookingId to number

    var existingBooking = new Booking(bookingId, null, null, userId);

    bookingModel.deleteExistingBooking(existingBooking, function(err, result) {
        if (err) {
            return next(err);
        }

        response.send(result);
    });
};