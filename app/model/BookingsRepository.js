var async = require('neo-async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    moment = require('moment'),
    Booking = require('./Booking'),
    db = new neo4j.GraphDatabase(config.db.url);

function BookingsRepository() {
}


/**
 * Lists all projects in system
 *
 * @param {Function} retValCallback return value callback
 */
BookingsRepository.prototype.listAllUserBookings = function (userId, retValCallback) {
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user)={userId}",
        "RETURN booking, project, person",
        "ORDER BY booking.workDay DESC, booking.workStarted"
    ].join('\n');

    var param = {
        userId: userId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            var bookingList = [];
            _.each(results, function (result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, userId, result.person.id));
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
BookingsRepository.prototype.listUserProjectBookings = function (userId, projectId, retValCallback) {
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user)={userId} and id(project) = {projectId}",
        "RETURN booking, project, person",
        "ORDER BY booking.workDay DESC, booking.workStarted"
    ].join('\n');

    var param = {
        userId: userId,
        projectId: projectId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            var bookingList = [];
            _.each(results, function (result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, userId, result.person.id));
            });

            retValCallback(null, bookingList);
        }
    ]);
};



/**
 * Returns last bookings of employee by given data
 * @param retValCallback
 */
BookingsRepository.prototype.listLastBookings = function (userId, workDaySince, retValCallback) {

    var query = [
        'MATCH (user:User)--(person:Person)-[booking:TIME_BOOKED]->(project:Project)',
        'WHERE id(user)={userId} AND booking.workDay>={workDaySince}',
        'RETURN user, person, booking, project',
        "ORDER BY booking.workDay, booking.workStarted"
    ].join('\n');

    var params = {
        userId: userId,
        workDaySince: workDaySince
    }

    async.waterfall([

        function (callback) {
            db.query(query, params, callback);
        }

    ], function (err, data) {
        if (err) {
            return retValCallback(err);
        }

        var retVal = [];
        _.each(data, function (bookingData) {
            retVal.push(new Booking(bookingData.booking.id, bookingData.booking.data, bookingData.project.id, userId, bookingData.person.id));
        })

        retValCallback(null, retVal);
    });

};

/**
 * Lists all projects in system
 *
 * @param start starting from
 * @param limit limit selection
 *
 * @param {Function} retValCallback return value callback
 */
BookingsRepository.prototype.listBookings = function (start, limit, retValCallback) {
    var countQuery = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "RETURN count(booking) AS cnt"
    ].join('\n');
    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]-(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "RETURN  user, booking, project, person",
        "ORDER BY booking.workDay DESC, booking.workStarted",
        "SKIP {skip} LIMIT {limit}"
    ].join('\n');

    var params = {
        limit: limit,
        skip: start // TODO: Evaluate if -1 is needed
    }
    var count = 0;
    async.waterfall([
        function (callback) {
            db.query(countQuery, {}, callback);
        },
        function (result, callback) {
            count = result[0].cnt;
            callback();
        },
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {
            if (!results) {
                return callback('Cannot get bookings');
            }

            var bookingList = [];
            _.each(results, function (result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id, result.person.id));
            });

            callback(null, {
                count: count,
                start: start,
                limit: limit,
                data: bookingList
            })
        }], retValCallback);

};

/**
 * Creates a new booking for a related project
 * @param booking booking to be persisted
 * @param retValCallback callback to be called after
 */
BookingsRepository.prototype.createNewBooking = function (booking, retValCallback) {

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

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
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
BookingsRepository.prototype.updateExistingBooking = function (booking, retValCallback) {
    async.waterfall([
        function (callback) {
            BookingsRepository.prototype.findBooking(booking, callback);
        },
        function (foundBooking, callback) {
            if (!foundBooking) {
                callback('Cannot find booking by given id');
            }

            if (booking.projectId === foundBooking.projectId) {
                // by existing booking, only data need to be changed
                async.waterfall([
                    function (callback) {
                        db.getRelationshipById(booking.id, callback);
                    },
                    function (relation, callback) {
                        _.extend(relation.data, booking.data);
                        relation.save(callback);
                    }
                ], callback);

            } else {
                // Changing of booking mean that a new relation need to be created and old one removed
                async.waterfall([
                    function (callback) {
                        db.getRelationshipById(booking.id, callback);
                    },
                    function (relation, callback) {
                        relation.del(function () {
                        });
                        BookingsRepository.prototype.createNewBooking(booking, callback);
                    }
                ], callback);
            }

        },
        function (updatedBooking, callback) {
            BookingsRepository.prototype.findBookingById(updatedBooking.id, callback);
        }
    ], retValCallback);

};

/**
 * Process a search for a booking according to the given parameters
 */
BookingsRepository.prototype.findBooking = function (booking, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user) = {userId} and id(booking)={bookingId}",
        "RETURN booking,project,user,person"
    ].join('\n');

    var param = {
        bookingId: booking.id,
        userId: booking.userId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            if (!results || results.length !== 1) {
                return callback('Booking not found!');
            }

            var result = results[0];

            var foundBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id, result.person.id);
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
BookingsRepository.prototype.findBookingById = function (bookingId, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(booking)={bookingId}",
        "RETURN booking,project,user,person"
    ].join('\n');

    var param = {
        bookingId: bookingId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            if (!results || results.length !== 1) {
                return callback('Booking not found!');
            }

            var result = results[0];

            var foundBooking = new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id, result.person.id);
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
BookingsRepository.prototype.findBookingCollidations = function (booking, retValCallback) {

    var query = [
        "MATCH (user:User)-[:HAS_PROFILE]->(person:Person)-[booking:TIME_BOOKED]->(project:Project)",
        "WHERE id(user) = {userId} and booking.workDay>={minWorkDay} and booking.workDay<={maxWorkDay} and (",

        "booking.workStarted<={workStarted} and booking.workFinished>{workStarted} ",
        " or ",
        "booking.workStarted<{workFinished} and booking.workFinished>={workFinished}",
        " or ",
        "booking.workStarted>{workStarted} and booking.workFinished<{workFinished}",

        ") RETURN booking,project,user, person"
    ].join('\n');

    var beginning = moment(booking.workDay).hours(0).startOf('hour').valueOf();
    var ending = moment(booking.workDay).add(1, 'days').hours(0).endOf('hour').valueOf();
    var param = {
        minWorkDay: beginning,
        maxWorkDay: ending,
        workStarted: booking.workStarted,
        workFinished: booking.workFinished,
        userId: booking.userId
    };

    async.waterfall([

        function (callback) {
            db.query(query, param, callback);
        },
        function (results, callback) {
            var bookingList = [];
            _.each(results, function (result) {
                bookingList.push(new Booking(result.booking.id, result.booking.data, result.project.id, result.user.id, result.person.id));
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
BookingsRepository.prototype.deleteExistingBooking = function (booking, retValCallback) {
    var projectId, userId, personId;
    async.waterfall([
        function (callback) {
            BookingsRepository.prototype.findBooking(booking, callback);
        },
        function (booking, callback) {
            if (!booking) {
                return callback('Booking not found');
            }
            projectId = booking.projectId;
            userId = booking.userId;
            personId = booking.personId;
            db.getRelationshipById(booking.id, callback);
        },
        function (relation, callback) {

            relation.del(callback);
        },
        function (callback) {
            callback(null, {
                id: booking.id,
                projectId: projectId,
                userId: userId,
                personId: personId
            });
        }
    ], retValCallback);
};


module.exports = BookingsRepository;