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
        "RETURN booking, project"
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
                bookingList.push(new Booking(result.booking, result.project));
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
        "RETURN user, booking, project"
    ].join('\n');

    async.waterfall([

        function(callback) {
            db.query(query, {}, callback);
        },
        function(results, callback) {
            var bookingList = [];
            _.each(results, function(result) {
                bookingList.push(new Booking(result.booking, result.project, result.user));
            });

            retValCallback(null, bookingList);
        }
    ]);
};



module.exports = BookingsRepository;