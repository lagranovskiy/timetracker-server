var amqp = require('amqp');
var async = require('neo-async');

/**
 * Communication controller
 * @param io
 */
var sockets = function (io) {

    var bookingsSocket = io.of('/bookings');

    bookingsSocket.on('connection', function (socket) {
        console.info("!!!!!!!!Hey ich habe eine Verbindung!!!!!");
        bookingsSocket.emit('message', 'connected');

    });

    var connection = null;

    async.waterfall([
        function (callback) {
            connection = amqp.createConnection({url: "amqp://admin:i9lmgtjm0Jzj@localhost:5672"});
            connection.on('ready', function () {
                callback(null, connection);
            });
        },
        function (connection, callback) {
            console.log('Connection ' + connection + ' is open');
            connection.exchange('booking-exchange', {}, function (exchange) {
                console.log('Booking exchange ' + exchange.name + ' is open');
                callback(null, exchange);
            });
        },
        function (exchange, callback) {

            connection.queue('booking-queue', function (queue) {
                console.log('Booking queue ' + queue.name + ' is open');
                callback(null, queue, exchange)
            });
        },
        function (queue, exchange, callback) {
            queue.bind(exchange, '#'); // TODO: Think about filtering for multiple channels
            callback(null, queue, exchange);
        }
    ], function (err, queue, exchange) {
        if (err) {
            return console.error(err);
        }
        console.log('Queue ' + queue.name + ' initialized');
        queue.subscribe(function (msg) {
            console.info('>> Recieved booking (' + msg + ') event  <<');
            bookingsSocket.emit('booking', msg);
        });
    });


}

module.exports = sockets;