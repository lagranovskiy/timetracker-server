/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var BookingsRepository = require('../model/BookingsRepository');
var bookingsRepository = new BookingsRepository();

/**
 * Lists all bookings the current authenticated user ever made
 * TODO: Implement limit functionality
 */
exports.listUserBookings = function(request, response, next) {
    var userId = request.user.getDbId();

    bookingsRepository.listAllUserBookings(userId, function(err, results) {
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
    console.info('We will implement list of bookings soon');
    bookingsRepository.listAllBookings(function(err, results) {
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

    console.info('We will implement creating of bookings soon');
    // projectRepository.deleteProject(projectId, function(err, results) {
    //     if (err) {
    //         return next(err);
    //     }
    //
    //     response.send(results);
    // });
};

exports.saveBooking = function(request, response, next) {
    var bookingId = request.params.bookingId;

    if (!bookingId) {
        return next('Cannot save booking. No bookingId found in request.');
    }

    console.info('We will implement save bookings soon');

    // projectRepository.deleteProject(projectId, function(err, results) {
    //     if (err) {
    //         return next(err);
    //     }
    //
    //     response.send(results);
    // });
};

exports.deleteBooking = function(request, response, next) {
    var bookingId = request.params.bookingId;

    if (!bookingId) {
        return next('Cannot delete booking. No bookingId found in request.');
    }

    console.info('We will implement delete bookings soon');
    // projectRepository.deleteProject(projectId, function(err, results) {
    //     if (err) {
    //         return next(err);
    //     }
    //
    //     response.send(results);
    // });
};