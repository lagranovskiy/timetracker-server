var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Booking = function(bookingId, bookingData, projectId, userId, personId) {

    var data = {};
    if (bookingData) {
        extend(data, bookingData);
    }


    return extend(Booking.super_(bookingId, bookingData), {

        /**
         *  Returns the day of work for booking
         * * */
        get workDay() {
            return data.workDay;
        },

        /**
         *  Returns the time work started
         * * */
        get workStarted() {
            return data.workStarted;
        },

        /**
         *  Returns the time work finished
         * * */
        get workFinished() {
            return data.workFinished;
        },

        /**
         *  Returns the pause in minutes
         * * */
        get pause() {
            return data.pause;
        },

        /**
         *  Returns the time booking created
         * * */
        get createdTime() {
            return data.createdTime;
        },

        /**
         *  Returns the time booking last updated
         * * */
        get lastUpdatedTime() {
            return data.lastUpdatedTime;
        },

        /**
         *  Returns the comment for the booking
         * */
        get comment() {
            return data.comment;
        },

        /**
         *  Returns the project id the booking is assigned to
         * */
        get projectId() {
            return projectId;
        },

        /**
         *  Returns the user id the booking is assigned to
         * */
        get userId() {
            return userId;
        },

        /**
         *  Returns the person id the booking is assigned to
         * */
        get personId() {
            return personId;
        }

    });
};

util.inherits(Booking, Entity);

module.exports = Booking;