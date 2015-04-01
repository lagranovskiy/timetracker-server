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
exports.resetData = function(request, response, next) {
    dataRepository.resetData(function(err, results) {
        if (err) {
            return next({
                success: false,
                total: 1,
                data: err
            });
        }

        response.json({
            success: true,
            total: 1,
            data: 'ok'
        });
    });
};