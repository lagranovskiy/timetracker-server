/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var BookingsRepository = require('../model/BookingsRepository');
var bookingsRepository = new BookingsRepository();
var Booking = require('../model/Booking');

/**
 * Lists all bookings the current authenticated user ever made
 * TODO: Implement limit functionality
 */
exports.listUserBookings = function(request, response, next) {
    var userId = request.user.getDbId();
    console.info('Listing of all bookings of user with id' + userId);


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
    console.info('Listing of all bookings');

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
    var userId = request.user.getDbId();

    console.info('Creating of a new booking for user ' + userId);

    var bookingData = request.body;
    if (bookingData.id) {
        return next('Cannot create booking that already has ID. Please use update method instead.');
    }

    var bookingDataUserId = bookingData.userId;
    var bookingDataProjectId = bookingData.projectId;

    if (bookingDataUserId && bookingDataUserId !== userId) {
        return next('Cannot save booking. Currently identified user is not same with user defined in the booking.');
    }

    bookingData = _.omit(bookingData, ['id', 'projectId', 'userId']);
    var newBooking = new Booking(null, bookingData, bookingDataProjectId, userId);

    bookingsRepository.createNewBooking(newBooking, function(err, result) {
        if (err) {
            return next(err);
        }

        response.send(result);
    });
};

/**
 * Updates existing booking
 */
exports.saveBooking = function(request, response, next) {
    var userId = request.user.getDbId();
    var bookingId = request.params.bookingId;

    console.info('Updating of a existing booking with id ' + bookingId + 'for user ' + userId);

    if (!bookingId) {
        return next('Cannot save booking. No bookingId found in request.');
    }
    var bookingData = request.body;
    if (!bookingData.id) {
        return next('Cannot update booking that has no ID yet. Please use create method instead.');
    }

    var bookingDataUserId = bookingData.userId;
    var bookingDataProjectId = bookingData.projectId;

    if (bookingDataUserId && bookingDataUserId !== userId) {
        return next('Cannot save booking. Currently identified user is not same with user defined in the booking.');
    }

    bookingData = _.omit(bookingData, ['id', 'projectId', 'userId']);
    var existingBooking = new Booking(bookingId, bookingData, bookingDataProjectId, userId);

    bookingsRepository.updateExistingBooking(existingBooking, function(err, result) {
        if (err) {
            return next(err);
        }

        response.send(result);
    });
};

exports.deleteBooking = function(request, response, next) {
    var userId = request.user.getDbId();
    var bookingId = request.params.bookingId;

    console.info('Deliting of a existing booking with id ' + bookingId + ' for user ' + userId);

    if (!bookingId) {
        return next('Cannot delete booking. No bookingId found in request.');
    }
    bookingId = bookingId * 1; // Convert bookingId to number

    var existingBooking = new Booking(bookingId, null, null, userId);

    bookingsRepository.deleteExistingBooking(existingBooking, function(err, result) {
        if (err) {
            return next(err);
        }

        response.send(result);
    });
};