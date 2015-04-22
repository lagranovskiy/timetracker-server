'use strict';

var amqp = require('amqp');
var async = require('neo-async');

/**
 * Communication controller
 * @param io
 */
var sockets = function (io, config) {
    io.set('origins', '*:*');
    var timetrackerSocket = io.of('/');

    timetrackerSocket.on('connection', function (socket) {
        console.info(">> Connection to the socket established <<");
    });

    var connection = null;

    async.waterfall([
            function (callback) {
                connection = amqp.createConnection({url: config.jmsUrl.url});
                connection.once('ready', function () {
                    callback(null, connection);
                });
            },
            function (connection, callback) {
                console.log('JMS Reciever: Connection ' + connection + ' is open');
                connection.exchange(config.jmsUrl.exchangeName, {}, function (exchange) {
                    console.log('>>JMS Reciever:  Timetracker exchange ' + exchange.name + ' is open <<');
                    callback(null, exchange);
                });
            },
            function (exchange, callback) {

                async.parallel({
                        booking: function (queueCB) {
                            connection.queue('booking-queue', function (queue) {
                                console.log('JMS Reciever: Booking queue ' + queue.name + ' is open');
                                queue.bind(exchange, 'booking.*');
                                queueCB(null, queue);
                            });
                        },
                        assignment: function (queueCB) {
                            connection.queue('assignment-queue', function (queue) {
                                console.log('JMS Reciever: Assignment queue ' + queue.name + ' is open');
                                queue.bind(exchange, 'assignment.*');
                                queueCB(null, queue);
                            });
                        }
                    },
                    function (err, results) {
                        callback(null, results.booking, results.assignment);
                    });
            }
        ],
        function (err, bookingQueue, assignmentQueue) {
            if (err) {
                return console.error(err);
            }
            console.log('JMS Reciever: Queue ' + bookingQueue.name + ' initialized');
            console.log('JMS Reciever: Queue ' + assignmentQueue.name + ' initialized');


            bookingQueue.subscribe(function (message, headers, deliveryInfo) {
                console.info('>> JMS Reciever: Recieved bookingQueue (' + message + ') event  <<');
                timetrackerSocket.emit('booking', {
                    key: deliveryInfo.routingKey,
                    message: message
                });
            });

            assignmentQueue.subscribe(function (message, headers, deliveryInfo) {
                console.info('>> JMS Reciever: Recieved assignmentQueue (' + message + ') event  <<');
                timetrackerSocket.emit('assignment', {
                    key: deliveryInfo.routingKey,
                    message: message
                });
            });
        });


};

module.exports = sockets;