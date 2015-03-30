var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
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

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user) = {userId} and id(project) = {projectId} and id(booking)={bookingId}",
        "SET booking={bookingData}",
        "RETURN booking,project,user"
    ].join('\n');

    var param = {
        bookingId: booking.id,
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
                return callback('Booking not found!');
            }

            var result = results[0];

            var createdBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id);
            return callback(null, createdBooking);

        }
    ], retValCallback);

};




/**
 *Removes a booking relation
 * @param booking booking to be persisted
 * @param retValCallback callback to be called after
 */
BookingsRepository.prototype.deleteExistingBooking = function(booking, retValCallback) {

    // First evaluate if relation may be removed (user is authorized to remove it)
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->()",
        "WHERE id(user) = {userId} and id(booking)={bookingId}",
        "DELETE booking"
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
            // Actually no possibility found to test if removal was successful
            return callback(null, true);

        }
    ], retValCallback);

};




module.exports = BookingsRepository;