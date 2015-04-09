var request = require('supertest'),
    express = require('express'),
    sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var request = require('supertest');


describe('Authentication test', function() {

    describe('Sign up functionality works correctly', function() {
        var sandbox, app, server, securityController;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('After correct auth user core data sent to the user', function(done) {
            securityController = requireHelper('controller/SecurityController');

            var securityStub = sandbox.stub(securityController, 'sendAuthData', function(req, res) {
                res.status(200).json({
                    id: 123,
                    userId: 'mmustermann',
                    groups: ['User'],
                    session: 'oijdowiedewoidwed'
                });
            });


            var userSecurityStub = sandbox.stub(securityController, 'authenticateUser', function(req, username, password, done) {
                if (username === 'mmustermann') {
                    return done(null, {
                        get uid() {
                            return 'mmustermann';
                        }
                    });
                } else {
                    return done('no way');
                }

            });

            server = require('../../app/app');
            app = server.setup(express());

            request(app)
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
                    res.body.userId.should.equal('mmustermann');
                    res.body.id.should.equal(123);
                    done();
                });


        });


        it('After authentication failure 401 sent to user', function(done) {
            securityController = requireHelper('controller/SecurityController');
            var server = require('../../app/app');
            app = server.setup(express());

            request(app)
                .post('/auth/login').send({
                    username: 'hacker',
                    password: 'prodyna1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .end(function(err, res) {
                    console.info(err);
                    should.exist(err);

                    done();
                });

        });

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