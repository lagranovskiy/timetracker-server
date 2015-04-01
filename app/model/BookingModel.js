var Booking = require('./Booking');
var _ = require('underscore');
var moment = require('moment');
var BookingsRepository = require('../model/BookingsRepository');
var bookingsRepository = new BookingsRepository();

var BookingModel = function() {

    /**
     * Validates booking according to the logical constraints.
     *
     * @param booking booking object for validation
     * */
    function validateBooking(booking, callback) {

        if (!booking) {
            return callback('No Booking given');
        }

        if (!booking.workDay) {
            return callback('Work Day of booking may not be empty');
        }

        if (!booking.workStarted) {
            return callback('Work started time of booking may not be empty');
        }
        if (!booking.workFinished) {
            return callback('Work Finished time of booking may not be empty');
        }

        if (booking.workStarted >= booking.workFinished) {
            return callback('Cannot create booking. Work finished time is equal or less then work started time.');
        }

        if (!booking.pause || booking.pause * 1 < 0) {
            return callback('Pause of booking must be >= 0');
        }


        if (!booking.projectId) {
            return callback('Project related to booking may not be empty');
        }

        if (!booking.userId) {
            return callback('User id of booking may not be empty');
        }


    }

    /**
     * Instanciates a new booking instance
     * @param bookingData booking data to be evaluated
     *
     * */
    function instanciateBooking(bookingData) {
        var bookingDataProjectId = bookingData.projectId;
        var bookingUserId = bookingData.userId;
        var bookingId = bookingData.id;

        bookingData = _.omit(bookingData, ['id', 'projectId', 'userId', 'data']);
        var newBooking = new Booking(bookingId, bookingData, bookingDataProjectId, bookingUserId);

        return newBooking;
    }

    return {

        /**
         * Creates a new booking
         * */
        createNewBooking: function(bookingData, callback) {
            if (!bookingData) {
                return callback('No Booking data given');
            }

            if (bookingData.id) {
                return callback('Cannot create booking that already has ID. Please use update method instead.');
            }
            var newBooking = instanciateBooking(bookingData);

            validateBooking(newBooking, callback);

            this.testBookingCollisions(newBooking, function(err) {
                if (err) {
                    return callback(err);
                }

                bookingsRepository.createNewBooking(newBooking, function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, result);
                });


            });


        },

        /**
         * Updates existing booking
         * */
        updateBooking: function(bookingData, callback) {
            if (!bookingData) {
                return callback('No Booking data given');
            }
            var bookingDataUserId = bookingData.userId;
            var bookingDataProjectId = bookingData.projectId;

            if (!bookingData.id) {
                return callback('Cannot update nonpersistent booking');
            }

            var existingBooking = instanciateBooking(bookingData);
            validateBooking(existingBooking, callback);

            this.testBookingCollisions(existingBooking, function(err) {
                if (err) {
                    return callback(err);
                }

                bookingsRepository.updateExistingBooking(existingBooking, function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, result);
                });
            });

        },

        /**
         * Removes booking by given parameters
         * @param bookingId Id of the booking to be removed
         * @param userId id of the authenticated user
         * */
        deleteBooking: function(bookingId, userId, callback) {
            if (!bookingId || !userId) {
                return callback('Missing mandatory information for booking removal');
            }

            var bookingInstance = instanciateBooking({
                id: bookingId,
                userId: userId
            });

            bookingsRepository.deleteExistingBooking(bookingInstance, function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            });
        },


        /**
         * testBookingCollisions function - Tests if booking doesnt collidate with other bookings
         *
         * @param  {type} booking  booking to be tested
         * @param  {type} callback callback for result
         * @return {type}
         */
        testBookingCollisions: function(booking, callback) {

            if (!booking) {
                return callback('Cannot test collidations of null booking.');
            }

            bookingsRepository.findBookingCollidations(booking, function(err, result) {
                if (err) {
                    return callback(err);
                }

                if (result.length && result.length > 0) {
                    var bookingList = '';
                    _.each(result, function(booking) {
                        bookingList = bookingList + moment(booking.workDay).format("L") + ' from: ' + moment(booking.workStarted).format("HH:mm") + ' to: ' + moment(booking.workFinished).format("HH:mm") + '\n';
                    });

                    return callback('Booking collidates with following bookings:\n' + bookingList, result);
                } else {
                    callback(null, true);
                }
            });
        }


    };

};

module.exports = BookingModel;