'use strict';
/*jshint expr: true*/

var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../require_helper');
var BookingModel = requireHelper('model/BookingModel');
var Booking = requireHelper('model/Booking');
var BookingsRepository = requireHelper('model/BookingsRepository');

var config = {
    db: {
        url: 'http://localhost:7474'
    }
};


describe('Booking model test', function () {
    var sandbox, bookingModel;

    var testBookingInput = {
        userId: 101,
        workDay: 1599855100,
        workStarted: 1599855000,
        workFinished: 1599855100,
        pause: '30',
        comment: 'Test comment',
        projectId: 101

    };

    var testExistingBookingInput = {
        id: 91,
        userId: 101,
        workDay: 1599855100,
        workStarted: 1599855000,
        workFinished: 1599855100,
        pause: '30',
        comment: 'Test comment',
        projectId: 101

    };

    var testBookingRs = [{
        booking: {
            id: 100,
            data: {
                workDay: 1599855100,
                workStarted: 1599855000,
                workFinished: 1599855100,
                pause: '30',
                comment: 'Test comment'
            }
        },
        project: {
            id: 101

        },
        person: {
            id: 101

        },
        user: {
            id: 1234

        }
    }];


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test booking model', function () {

        it('Test if constructor works', function () {
            bookingModel = new BookingModel();
            should(bookingModel == null).eql(false);
        });


        it('Test getting of all user booking', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            bookingModel.listAllUserBookings(1234, function (err, bookings) {
                should(bookings.length).be.equal(1);
                should(bookings[0].id).be.equal(100);
                should(bookings[0].projectId).be.equal(101);
                should(bookings[0].userId).be.equal(1234);
                done();
            });

        });


        it('Test getting of all user project bookings', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            bookingModel.listUserProjectBookings(1234, 101, function (err, bookings) {
                should(bookings.length).be.equal(1);
                should(bookings[0].id).be.equal(100);
                should(bookings[0].projectId).be.equal(101);
                should(bookings[0].userId).be.equal(1234);
                done();
            });

        });


        it('Test getting of all bookings', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                if (query.indexOf('cnt') >= 0) {
                    callback(null, [{cnt: 30}]);
                } else {
                    callback(null, testBookingRs);
                }
            });

            bookingModel.listAllBookings(0, 20, function (err, bookings) {
                should(bookings.data.length).be.equal(1);
                should(bookings.data[0].id).be.equal(100);
                should(bookings.data[0].projectId).be.equal(101);
                should(bookings.data[0].userId).be.equal(1234);
                done();
            });

        });

        it('Test updating of existing booking', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getRelationshipById', function (relationId, callback) {
                var relation = {
                    id: relationId,
                    data: testBookingRs[0].booking.data,
                    save: function (callback) {
                        return callback(null, testBookingRs[0]);
                    }
                };
                callback(null, relation);
            });


            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                callback(null, []);
            });


            bookingModel.updateBooking(testExistingBookingInput, function (err, booking) {
                should.not.exist(err);
                (booking !== undefined).should.be.ok;
                should(booking.id).be.equal(100);
                should(booking.projectId).be.equal(101);
                should(booking.userId).be.equal(1234);
                done();
            });
        });


        it('Test creating of new booking', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                callback(null, []);
            });


            bookingModel.createNewBooking(testBookingInput, function (err, booking) {
                should.not.exist(err);
                (booking !== undefined).should.be.ok;
                should(booking.id).be.equal(100);
                should(booking.projectId).be.equal(101);
                should(booking.userId).be.equal(1234);
                done();
            });
        });


        it('Test booking model validation finish before start', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                callback(null, []);
            });


            var testBookingInput1 = {
                userId: 101,
                workDay: 1599855100,
                workStarted: 1599855500,
                workFinished: 1599855100,
                pause: '30',
                comment: 'Test comment',
                projectId: 101

            };

            bookingModel.createNewBooking(testBookingInput1, function (err, booking) {
                should(err).be.String;
                done();
            });

        });

        it('Test booking model validation pause must be >=0', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                callback(null, []);
            });


            var testBookingInput1 = {
                userId: 101,
                workDay: 1599855100,
                workStarted: 1599855000,
                workFinished: 1599855100,
                pause: '-1',
                comment: 'Test comment',
                projectId: 101

            };

            bookingModel.createNewBooking(testBookingInput1, function (err, booking) {
                should(err).be.String;
                done();
            });

        });

        it('Test booking model validation data', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                callback(null, []);
            });


            var testBookingInput1 = {
                userId: 101,
                workDay: null,
                workStarted: null,
                workFinished: null,
                pause: '-1',
                comment: 'Test comment',
                projectId: null

            };

            bookingModel.createNewBooking(testBookingInput1, function (err, booking) {
                should(err).be.String;
                done();
            });

        });



        it('Test booking collidation', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                var collisionBooking = new Booking(123, testBookingInput, 150, 105);
                var collistionArray = [];
                collistionArray.push(collisionBooking);
                callback(null, collistionArray);
            });


            bookingModel.createNewBooking(testBookingInput, function (err, booking) {
                should(err).be.String;
                done();
            });

        });


        it('Test booking collidation method', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(BookingsRepository.prototype, 'findBookingCollidations', function (booking, callback) {
                var collisionBooking = new Booking(133, testBookingInput, 150, 105);
                var collistionArray = [];
                collistionArray.push(collisionBooking);
                callback(null, collistionArray);
            });

            var collisionBooking = new Booking(123, testBookingInput, 150, 105);

            bookingModel.testBookingCollisions(collisionBooking, function (err, booking) {
                should.exist(err);
                done();
            });

        });


        it('Test deletion of bookings', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getRelationshipById', function (relationId, callback) {
                var relation = {
                    id: relationId,
                    data: testBookingRs[0].booking.data,
                    del: function (callback) {
                        return callback(null);
                    }
                };
                callback(null, relation);
            });


            bookingModel.deleteBooking(123, 1234, function (err, success) {
                should.not.exist(err);
                should(success.id).be.equal(123);
                done();
            });

        });


        it('Test my last bookings works correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testBookingRs);
            });



            bookingModel.listLastBookings(123, 100, 500, function (err, bookings) {
                should.not.exist(err);
                should.exist(bookings);
                should(bookings[0].id).be.equal(100);
            });

            bookingModel.listLastBookings(null, null, null, function (err, bookings) {
                should.exist(err);
            });

            bookingModel.listLastBookings(123, null, null, function (err, bookings) {
                should.exist(err);
            });

            bookingModel.listLastBookings(123, 500, null, function (err, bookings) {
                should.exist(err);
            });
            done();

        });


    });

});