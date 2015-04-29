var Booking = require('./Booking');
var _ = require('underscore');
var async = require('neo-async');
var moment = require('moment');
var BookingsRepository = require('../model/BookingsRepository');
var bookingsRepository = new BookingsRepository();

var BookingModel = function () {

    /**
     * Validates booking according to the logical constraints.
     *
     * @param booking booking object for validation
     * */
    function validateBooking(booking) {
        var retVal = [];
        if (!booking) {
            retVal.push('No Booking given');
        }

        if (!booking.workDay) {
            retVal.push('Work Day of booking may not be empty');

        }

        if (!booking.workStarted) {
            retVal.push('Work started time of booking may not be empty');

        }
        if (!booking.workFinished) {
            retVal.push('Work Finished time of booking may not be empty');
        }

        if (booking.workStarted >= booking.workFinished) {
            retVal.push('Cannot create booking. Work finished time is equal or less then work started time.');
        }

        if (!booking.pause || booking.pause * 1 < 0) {
            retVal.push('Pause of booking must be >= 0');
        }


        if (!booking.projectId) {
            retVal.push('Project related to booking may not be empty');
        }

        if (!booking.userId) {
            retVal.push('User id of booking may not be empty');
        }

        return retVal.length > 0 ? retVal.join('\n') : null;

    }

    /**
     * Instanciates a new booking instance
     * @param bookingData booking data to be evaluated
     *
     * */
    function instanciateBooking(bookingData) {
        var bookingDataProjectId = bookingData.projectId;
        var bookingUserId = bookingData.userId;
        var personId = bookingData.personId;
        var bookingId = bookingData.id;

        bookingData = _.pick(bookingData, ['workDay', 'workStarted', 'workFinished', 'pause', 'createdTime', 'lastUpdatedTime', 'comment']);
        var newBooking = new Booking(bookingId, bookingData, bookingDataProjectId, bookingUserId, personId);

        return newBooking;
    }

    var bookingModel = {

        listLastBookings: function (userId, workDaySince, workDayTill, callback) {
            if (!userId) {
                return callback('User userid is null');
            }
            if (!workDaySince) {
                return callback('workDaySince is null');
            }

            if (!workDayTill) {
                return callback('workDayTill is null');
            }
            bookingsRepository.listLastBookings(userId, workDaySince, workDayTill, function (err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },
        /**
         * listUserBookings - List all bookings of given user
         *
         * @param  {type} userId   description
         * @param  {type} callback description
         * @return {type}          description
         */
        listAllUserBookings: function (userId, callback) {
            if (!userId) {
                return callback('User userid is null');
            }
            bookingsRepository.listAllUserBookings(userId, function (err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },

        /**
         * listUserProjectBookings - List all user booking of given project
         *
         * @param  {type} userId    description
         * @param  {type} projectId description
         * @param  {type} callback  description
         * @return {type}           description
         */
        listUserProjectBookings: function (userId, projectId, callback) {
            if (!userId) {
                return callback('User userid is null');
            }
            if (!projectId) {
                return callback('User project id is null');
            }
            bookingsRepository.listUserProjectBookings(userId, projectId, function (err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },


        /**
         * listAllBookings - Lists all of booking entries
         *
         * @param start starting from
         * @param limit limit selection
         * @param callback description
         * @return {type}          description
         */
        listAllBookings: function (start, limit, callback) {
            if (!_.isNumber(start) || !_.isNumber(limit)) {
                return callback('Please select start and limit for query');
            }
            bookingsRepository.listBookings(start, limit, function (err, results) {
                if (err) {
                    return callback(err);
                }

                callback(null, results);
            });
        },

        /**
         * Creates a new booking
         * */
        createNewBooking: function (bookingData, callback) {
            if (!bookingData) {
                return callback('No Booking data given');
            }

            if (bookingData.id) {
                return callback('Cannot create booking that already has ID. Please use update method instead.');
            }
            var newBooking = instanciateBooking(bookingData);

            async.waterfall([
                function (cb) {
                    cb(validateBooking(newBooking), newBooking);
                },
                function (validatedBooking, cb) {
                    bookingModel.testBookingCollisions(validatedBooking, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        return cb(null, validatedBooking);
                    });
                },
                function (nonCollidatingBooking, cb) {
                    bookingsRepository.createNewBooking(nonCollidatingBooking, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        return cb(null, result);
                    });

                }
            ], callback);

        },

        /**
         * Updates existing booking
         * */
        updateBooking: function (bookingData, callback) {
            if (!bookingData) {
                return callback('No Booking data given');
            }
            var bookingDataUserId = bookingData.userId;
            var bookingDataProjectId = bookingData.projectId;

            if (!bookingData.id) {
                return callback('Cannot update nonpersistent booking');
            }

            var existingBooking = instanciateBooking(bookingData);

            async.waterfall([
                function (cb) {
                    cb(validateBooking(existingBooking), existingBooking);
                },
                function (validatedBooking, cb) {
                    bookingModel.testBookingCollisions(validatedBooking, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        return cb(null, validatedBooking);
                    });
                },
                function (nonCollidatingBooking, cb) {
                    bookingsRepository.updateExistingBooking(nonCollidatingBooking, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        return cb(null, result);
                    });

                }
            ], callback);

        },

        /**
         * Removes booking by given parameters
         * @param bookingId Id of the booking to be removed
         * @param userId id of the authenticated user
         * */
        deleteBooking: function (bookingId, userId, callback) {
            if (!bookingId || !userId) {
                return callback('Missing mandatory information for booking removal');
            }

            var bookingInstance = instanciateBooking({
                id: bookingId,
                userId: userId
            });

            bookingsRepository.deleteExistingBooking(bookingInstance, function (err, result) {
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
        testBookingCollisions: function (booking, callback) {

            if (!booking) {
                return callback('Cannot test collidations of null booking.');
            }

            bookingsRepository.findBookingCollidations(booking, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result.length && result.length > 0) {

                    var bookingList = '';
                    _.each(result, function (collidatingBooking) {
                        if (collidatingBooking.id !== booking.id) {
                            bookingList = bookingList + moment(collidatingBooking.workDay).format("L") + ' from: ' + moment(collidatingBooking.workStarted).format("HH:mm") + ' to: ' + moment(collidatingBooking.workFinished).format("HH:mm") + '\n';
                        }
                    });
                    if (bookingList.length === 0) {
                        // Case where booking collidates with itself
                        return callback(null, true);
                    }

                    return callback('Booking collidates with following bookings:\n' + bookingList, result);
                } else {
                    callback(null, true);
                }
            });
        }


    };

    return bookingModel;
};

module.exports = BookingModel;