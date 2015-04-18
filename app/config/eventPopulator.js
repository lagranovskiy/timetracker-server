/**
 * Created by lagranovskiy on 17.04.15.
 */
var bookingController = require('../controller/BookingController');

var amqp = require('amqp');
var async = require('neo-async');

/**
 * Populates business events over rabbitMQ to all nodes
 * // https://www.centurylinkcloud.com/blog/post/tutorial-rabbitmq-node-js/
 // https://github.com/postwait/node-amqp#exchangebindsrcexchange-routingkey--callback

 */
var eventPopulator = function () {

    var connection = null;
    var bookingExchange = null;

    /**
     * Connection intialization
     */
    async.waterfall([
        function (callback) {
            connection = amqp.createConnection({url: "amqp://admin:i9lmgtjm0Jzj@localhost:5672"});
            connection.on('ready', function () {
                callback(null, connection);
            });
        },
        function (connection, callback) {
            connection.exchange('booking-exchange', {}, function (exchange) {
                console.log('Exchange ' + exchange.name + ' is open');
                callback(null, exchange);
            });
        }
    ], function (err, exch) {
        if (err) {
            return console.error(err);
        }
        bookingExchange = exch;
    });


    /**
     * Listening on emitted events and push them to the queue
     */
    bookingController.on('created', function (data) {
        console.info('>> Booking created notification (' + data + ')');
        bookingExchange.publish('created', data);
    });


}

module.exports = eventPopulator;