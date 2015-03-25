var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');
/**
 * Describes a project object
 * @param   {Object} node Node from db
 * @returns {Object} access api for entity
 */
var Booking = function(bookingNode, projectNode, userNode) {

    return extend(Booking.super_(bookingNode), {

        /**
         *  Returns the day of work for booking
         * * */
        get workDay() {
            return bookingNode.data.workDay;
        },

        /**
         *  Returns the time work started
         * * */
        get workStarted() {
            return bookingNode.data.workStarted;
        },

        /**
         *  Returns the time work finished
         * * */
        get workFinished() {
            return bookingNode.data.workFinished;
        },

        /**
         *  Returns the pause in minutes
         * * */
        get pause() {
            return bookingNode.data.pause;
        },

        /**
         *  Returns the time booking created
         * * */
        get createdTime() {
            return bookingNode.data.createdTime;
        },

        /**
         *  Returns the time booking last updated
         * * */
        get lastUpdatedTime() {
            return bookingNode.data.lastUpdatedTime;
        },

        /**
         *  Returns the comment for the booking
         * */
        get comment() {
            return bookingNode.data.comment;
        },

        /**
         *  Returns the project id the booking is assigned to
         * */
        get projectId() {
            if (projectNode.data) {
                return projectNode.data.id;
            }
            return null;
        },

        /**
         *  Returns the user id the booking is assigned to
         * */
        get userId() {
            if (userNode.data) {
                return userNode.data.id;
            }
            return null;
        }

    });
};

util.inherits(Booking, Entity);

module.exports = Booking;