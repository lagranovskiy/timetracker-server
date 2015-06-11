/**
 * Data Controller
 *
 **/
var async = require('neo-async');
var DataRepository = require('../model/DataRepository');
var dataRepository = new DataRepository();

/**
 * Resets database with default data set
 *
 */
exports.reinitDB = function (request, response, next) {
    if (process.env.NODE_ENV === 'dev') {
        async.waterfall([
            function (callback) {
                dataRepository.removeAllData(callback);
            },
            function (callback) {
                dataRepository.importData(callback);
            }
        ], function (err) {
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
    } else {
        return response.json({
            success: false,
            total: 0,
            data: 'you are runnign productive mode!! Incident will be reported.'
        });
    }


};