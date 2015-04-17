module.exports = function (io) {

    var bookingsSocket = io.of('/bookings');
    bookingsSocket.on('connection', function (socket) {
        console.info("!!!!!!!!Hey ich habe eine Verbindung!!!!!");
        bookingsSocket.emit('message', 'everyone');

    });


};