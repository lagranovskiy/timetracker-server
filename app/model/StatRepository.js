var async = require('neo-async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    Booking = require('./Booking'),
    db = new neo4j.GraphDatabase(config.db.url);

/**
 * Stat repository collects statistic information over the application to be accesed by the user
 * @constructor
 */
function StatRepository() {
}



/**
 * Returns the list of collegues data
 *
 * @param userId
 * @param retValCallback
 */
StatRepository.prototype.getCollegues = function (userId, retValCallback) {

    var query = [
        'MATCH (user:User)--(person:Person)-->(project:Project)<-[:TIME_BOOKED]-(college:Person)',
        'WHERE id(user)={userId} and not person = college',
        'RETURN DISTINCT project, college'
    ].join('\n');

    var params = {
        userId: userId
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
        _.each(data, function (collegeData) {
            retVal.push({
                forename: collegeData.college.data.forename,
                surname: collegeData.college.data.surname,
                birthday: collegeData.college.data.birthday,
                email: collegeData.college.data.email,
                phone: collegeData.college.data.phone,
                project: collegeData.project.data.projectName
            });
        })

        retValCallback(null, retVal);
    });

};

module.exports = StatRepository;