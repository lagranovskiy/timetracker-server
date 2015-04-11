/**
 * Person Controller
 *
 * Controlls project entities
 **/
var async = require('async');
var newrelic = require('newrelic');
var _ = require('underscore');
var UserModel = require('../model/UserModel');
var userModel = new UserModel();


/**
 * Resolves a list of all persons
 */
exports.listPersons = function (request, response, next) {
    console.info('Resolving a list of all persons.');

    userModel.listPersons(function (err, data) {
        if (err) {
            return next(err);
        }
        newrelic.recordMetric('Custom/Person/PersonCount', data.length);
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
exports.listRoles = function (request, response, next) {
    console.info('Getting of a role list');


    userModel.listRoles(function (err, data) {
        if (err) {
            return next(err);
        }

        response.send(data);
    });
};

/**
 * Updates a person with given information
 *
 * @param   {Object}   request  request object
 * @param   {Object}   response response object
 * @param   {Function} next     callback for continious process
 * @returns {void}
 */
exports.updatePerson = function (request, response, next) {
    console.info('Updating person Data');
    var personData = request.body;
    var personId = request.params.personId * 1;

    if (!personId) {
        next('Cannot update person. No userId found in request.');
        return;
    }
    if (!personData) {
        next('Cannot update person. No userData found in request.');
        return;
    }

    if (personData.id !== personId) {
        next('Cannot update person. No personData not match with given id.');
        return;
    }

    userModel.updatePerson(personData, function (err, data) {
        if (err) {
            return next(err);
        }
        response.send(data);
    });
};

