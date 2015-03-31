var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    moment = require('moment'),
    Booking = require('./Booking'),
    db = new neo4j.GraphDatabase(config.db.url);

function BookingsRepository() {}



/**
 * Lists all projects in system
 *
 * @param {Function} retValCallback return value callback
 */
BookingsRepository.prototype.listAllUserBookings = function(userId, retValCallback) {
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user)={userId}",
        "RETURN booking, project",
        "ORDER BY booking.workDay DESC, booking.workStarted"
    ].join('\n');

    var param = {
        userId: userId
    };

    async.waterfall([

        function(callback) {
            db.query(query, param, callback);
        },
        function(results, callback) {
            var bookingList = [];
            _.each(results, function(result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, userId));
            });

            retValCallback(null, bookingList);
        }
    ]);
};



/**
 * Lists all projects in system
 *
 * @param {Function} retValCallback return value callback
 */
BookingsRepository.prototype.listBookings = function(retValCallback) {
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "RETURN user, booking, project",
        "ORDER BY booking.workDay DESC, booking.workStarted"
    ].join('\n');

    async.waterfall([

        function(callback) {
            db.query(query, {}, callback);
        },
        function(results, callback) {
            var bookingList = [];
            _.each(results, function(result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id));
            });

            retValCallback(null, bookingList);
        }
    ]);
};

/**
 * Creates a new booking for a related project
 * @param booking booking to be persisted
 * @param retValCallback callback to be called after
 */
BookingsRepository.prototype.createNewBooking = function(booking, retValCallback) {

    var query = [
        "MATCH (project:Project)",
        // Disallow to book semething for user that has no role on project
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[:HAS_ROLE]->()-[:ON_PROJECT]->(project)",
        "WHERE id(user) = {userId} and id(project) = {projectId}",
        "CREATE (person)-[booking:TIME_BOOKED {bookingData}]->(project)",
        "RETURN booking,project,user"
    ].join('\n');

    var param = {
        userId: booking.userId,
        projectId: booking.projectId,
        bookingData: booking.data
    };

    async.waterfall([

        function(callback) {
            db.query(query, param, callback);
        },
        function(results, callback) {
            if (!results || results.length !== 1) {
                return callback('User has no rights to book to the given projects. Please check if he is on project role.');
            }

            var result = results[0];

            var createdBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id);
            return callback(null, createdBooking);

        }
    ], retValCallback);

};


/**
 * Creates a new booking for a related project
 * @param booking booking to be persisted
 * @param retValCallback callback to be called after
 */
BookingsRepository.prototype.updateExistingBooking = function(booking, retValCallback) {
    async.waterfall([
        function(callback) {
            BookingsRepository.prototype.findBooking(booking, callback);
        },
        function(foundBooking, callback) {
            if (!foundBooking) {
                callback('Cannot find booking by given id');
            }

            if (booking.projectId === foundBooking.projectId) {
                // by existing booking, only data need to be changed
                async.waterfall([
                    function(callback) {
                        db.getRelationshipById(booking.id, callback);
                    },
                    function(relation, callback) {
                        _.extend(relation.data, booking.data);
                        relation.save(callback);
                    }
                ], callback);

            } else {
                // Changing of booking mean that a new relation need to be created and old one removed
                async.waterfall([
                    function(callback) {
                        db.getRelationshipById(booking.id, callback);
                    },
                    function(relation, callback) {
                        relation.del(function() {});
                        BookingsRepository.prototype.createNewBooking(booking, callback);
                    }
                ], callback);
            }

        },
        function(updatedBooking, callback) {
            BookingsRepository.prototype.findBookingById(updatedBooking.id, callback);
        }
    ], retValCallback);

};

/**
 * Process a search for a booking according to the given parameters
 */
BookingsRepository.prototype.findBooking = function(booking, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user) = {userId} and id(booking)={bookingId}",
        "RETURN booking,project,user"
    ].join('\n');

    var param = {
        bookingId: booking.id,
        userId: booking.userId
    };

    async.waterfall([

        function(callback) {
            db.query(query, param, callback);
        },
        function(results, callback) {
            if (!results || results.length !== 1) {
                return callback('Booking not found!');
            }

            var result = results[0];

            var foundBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id);
            return callback(null, foundBooking);

        }
    ], retValCallback);

};




/**
 * BookingsRepository.prototype.findBookingById - Process a search for a booking according to the given booking id
 *
 * @param  {Function} retValCallback callback
 * @param  {Number} bookingId      ID for search
 */
BookingsRepository.prototype.findBookingById = function(bookingId, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(booking)={bookingId}",
        "RETURN booking,project,user"
    ].join('\n');

    var param = {
        bookingId: bookingId
    };

    async.waterfall([

        function(callback) {
            db.query(query, param, callback);
        },
        function(results, callback) {
            if (!results || results.length !== 1) {
                return callback('Booking not found!');
            }

            var result = results[0];

            var foundBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id);
            return callback(null, foundBooking);

        }
    ], retValCallback);

};




/**
 * BookingsRepository.prototype.testBookingAllowed - Evaluates if user may do such booking according to concurrency of times
 *
 * @param  {type} booking        description
 * @param  {type} retValCallback description
 * @return {type}                description
 */
BookingsRepository.prototype.findBookingCollidations = function(booking, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user) = {userId} and booking.workDay>={minWorkDay} and booking.workDay<={maxWorkDay} and (",

        "booking.workStarted<={workStarted} and booking.workFinished>{workStarted} ",
        " or ",
        "booking.workStarted<{workFinished} and booking.workFinished>={workFinished}",
        " or ",
        "booking.workStarted>{workStarted} and booking.workFinished<{workFinished}",

        ") RETURN booking,project,user"
    ].join('\n');

    var beginning = moment(booking.workDay).hours(0).startOf('hour').valueOf();
    var ending = moment(booking.workDay).hours(23).endOf('hour').valueOf();
    var param = {
        minWorkDay: beginning,
        maxWorkDay: ending,
        workStarted: booking.workStarted,
        workFinished: booking.workFinished,
        userId: booking.userId
    };

    async.waterfall([

        function(callback) {
            db.query(query, param, callback);
        },
        function(results, callback) {
            var bookingList = [];
            _.each(results, function(result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id));
            });


            return callback(null, bookingList);

        }
    ], retValCallback);

};


/**
 * Removes a booking relation
 *
 * @param booking booking to be persisted
 * @param retValCallback callback to be called after
 */
BookingsRepository.prototype.deleteExistingBooking = function(booking, retValCallback) {
    async.waterfall([
        function(callback) {
            BookingsRepository.prototype.findBooking(booking, callback);
        },
        function(booking, callback) {
            if (!booking) {
                return callback('Booking not found');
            }

            db.getRelationshipById(booking.id, callback);
        },
        function(relation, callback) {
            relation.del(callback);
        },
        function(callback) {
            callback(null, true);
        }
    ], retValCallback);
};




module.exports = BookingsRepository;