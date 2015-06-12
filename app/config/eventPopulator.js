/**
 * Created by lagranovskiy on 17.04.15.
 */
var bookingController = require('../controller/BookingController');
var assignmentController = require('../controller/AssignmentController');

var amqp = require('amqp');
var async = require('neo-async');

/**
 * Populates business events over rabbitMQ to all nodes
 * // https://www.centurylinkcloud.com/blog/post/tutorial-rabbitmq-node-js/
 // https://github.com/postwait/node-amqp#exchangebindsrcexchange-routingkey--callback

 */
var eventPopulator = function (config) {

    var connection = null;
    var exchange = null;

    /**
     * Connection intialization
     */
    async.waterfall([
        function (callback) {
            connection = amqp.createConnection({url: config.jmsUrl.url});
            connection.on('ready', function () {
                callback(null, connection);
            });
        },
        function (connection, callback) {
            connection.exchange(config.jmsUrl.exchangeName, {}, function (exchange) {
                console.log('Populator:  Exchange ' + exchange.name + ' is open');
                callback(null, exchange);
            });
        }
    ], function (err, exch) {
        if (err) {
            return console.error(err);
        }
        exchange = exch;
    });


    /**
     * Listening on emitted events and push them to the exchange
     */
    bookingController.on('created', function (data) {
        if(!exchange){
            return console.error('exchange not initialized');
        }
        console.info('>> Populator: Booking created notification (' + data + ')');
        exchange.publish('booking.created', data);
    });


    bookingController.on('updated', function (data) {
        if(!exchange){
            return console.error('exchange not initialized');
        }
        console.info('>> Populator: Booking updated notification (' + data + ')');
        exchange.publish('booking.updated', data);
    });

    bookingController.on('deleted', function (data) {
        if(!exchange){
            return console.error('exchange not initialized');
        }
        console.info('>> Populator: Booking deleted notification (' + data + ')');
        exchange.publish('booking.deleted', data);
    });


    assignmentController.on('created', function (data) {
        if(!exchange){
            return console.error('exchange not initialized');
        }
        console.info('>> Populator: Assignment created notification (' + data + ')');
        exchange.publish('assignment.created', data);
    });

    assignmentController.on('deleted', function (data) {
        if(!exchange){
            return console.error('exchange not initialized');
        }
        console.info('>> Populator: Assignment deleted notification (' + data + ')');
        exchange.publish('assignment.deleted', data);
    });
};

module.exports = eventPopulator;