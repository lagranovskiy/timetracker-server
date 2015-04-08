/**
 * Project Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var newrelic=require('newrelic');
var _ = require('underscore');
var PersonRepository = require('../model/PersonRepository');
var personRepository = new PersonRepository();


/**
 * Resolves a list of all persons
 */
exports.listPersons = function(request, response, next) {
    console.info('Resolving a list of all persons.');

    personRepository.listPersons(function(err, data) {
        if (err) {
            return next(err);
        }
        newrelic.recordMetric('Custom/Person/PersonCount',data.length);
        response.send(data);
    });
};

/**
 * Returns a list of all roles already existing in system
 *
 * @param request request
 * @param response response
 * @param next
 */
exports.listRoles = function(request, response, next){
    console.info('Getting of a role list');


    personRepository.listRoles(function(err, data) {
        if (err) {
            return next(err);
        }

        response.send(data);
    });
};

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


/**
 * Check if username exist
 */
exports.checkUsernameExists = function(request, response, next) {
    var userId = request.params.userId;
    console.info('Testing if user with id ' + userId + ' already exist.');

    var userExist;

    if (userId) {
        if (userId === 'mmustermann') {
            userExist = true;
        } else {
            userExist = false;
        }
        return response.status(200).send({
            userExist: userExist
        });
    } else {
        return response.status(500).send('error');
    }



};