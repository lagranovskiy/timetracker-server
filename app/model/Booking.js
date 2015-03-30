var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Booking = function(bookingId, bookingData, projectId, userId) {

    return extend(Booking.super_(bookingId, bookingData), {

        /**
         *  Returns the day of work for booking
         * * */
        get workDay() {
            return bookingData ? bookingData.workDay : null;
        },

        /**
         *  Returns the time work started
         * * */
        get workStarted() {
            return bookingData ? bookingData.workStarted : null;
        },

        /**
         *  Returns the time work finished
         * * */
        get workFinished() {
            return bookingData ? bookingData.workFinished : null;
        },

        /**
         *  Returns the pause in minutes
         * * */
        get pause() {
            return bookingData ? bookingData.pause : null;
        },

        /**
         *  Returns the time booking created
         * * */
        get createdTime() {
            return bookingData ? bookingData.createdTime : null;
        },

        /**
         *  Returns the time booking last updated
         * * */
        get lastUpdatedTime() {
            return bookingData ? bookingData.lastUpdatedTime : null;
        },

        /**
         *  Returns the comment for the booking
         * */
        get comment() {
            return bookingData ? bookingData.comment : null;
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
        }

    });
};

util.inherits(Booking, Entity);

module.exports = Booking;