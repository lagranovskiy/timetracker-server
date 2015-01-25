/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var _ = require('underscore');
var PersonRepository = require('../model/PersonRepository');
var personRepository = new PersonRepository();

/**
 * Returns person information for given person
 *
 * @param   {Object}   request  request object
 * @param   {Object}   response response object
 * @param   {Function} next     callback for continious process
 * @returns {void}
 */
exports.getPersonData = function(request, response, next) {
    /*    var userId = request.session.user.getUid();
        projectRepository.listVisibleProjects(userId, function(err, results) {
            if (err) {
                return next(err);
            }

            response.send(results);
        });**/
};