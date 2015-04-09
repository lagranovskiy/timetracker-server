var request = require('supertest'),
    express = require('express'),
    sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var securityController = requireHelper('controller/SecurityController');
/**
describe('Authentication test', function() {

            describe('Sign up functionality works correctly', function() {
                var sandbox, app, request;

                beforeEach(function() {
                    sandbox = sinon.sandbox.create();

                    var securityStub = sandbox.stub(securityController, 'sendAuthData', function(req, res) {
                        res.status(200).json({
                            id: 123,
                            userId: 'tester',
                            groups: ['User'],
                            session: 'oijdowiedewoidwed'
                        });
                    });


                    var userSecurityStub = sandbox.stub(securityController, 'authenticateUser', function(req, username, password, done) {
                        done(null, {
                            get uid() {
                                return 'tester';
                            }
                        });
                    });

                    app = require('../../app/app');
                    request = require('supertest')(app);

                });

                afterEach(function(done) {
                    sandbox.restore();

                });

                it('After correct auth user core data sent to the user', function(done) {
                    request
                        .post('/auth/login').send({
                            username: 'mmustermann',
                            password: 'prodyna1'
                        })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function(err, res) {
                            console.info(err);
                            should.not.exist(err);
                            res.body.userId.should.equal('tester');
                            res.body.id.should.equal(123);
                            done();
                        });


                });


                /**  Fails because passport caches stub somewhere in its implementation and says he is authenticated

                it('After authentication failure 401 sent to user', function(done) {

                    var securityStub = sandbox.stub(security, 'authenticateUser', function(req, username, password, done) {
                        // Authentication failed
                        done(null, false);
                    });

                    var supertestserver = request(requireHelper('app'));

                    supertestserver
                        .post('/auth/login').send({
                            username: 'mmustermann',
                            password: 'prodyna1'
                        })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(401)
                        .end(function(err, res) {
                            console.info(err);
                            should.not.exist(err);

                            done();
                        });

                });


    });

     });
     */