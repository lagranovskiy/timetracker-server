/**
 * Data Controller
 *
 **/
var async = require('async');
var DataRepository = require('../model/DataRepository');
var dataRepository = new DataRepository();

/**
 * Resets database with default data set
 *
 */
exports.reinitDB = function(request, response, next) {

    async.waterfall([
        function(callback) {
            dataRepository.removeAllData(callback);
        },
        function(callback) {
            dataRepository.importData(callback);
        }
    ], function(err, results) {
        if (err) {
            return next({
                success: false,
                total: 1,
                data: err
            });
        }

        return response.json({
            success: true,
            total: 1,
            data: 'ok'
        });
    });

};