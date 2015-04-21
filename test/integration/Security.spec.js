var request = require('supertest'),
    express = require('express'),
    sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var request = require('supertest');


describe('Authentication test', function () {

    var server = requireHelper('app');
    var app = server.setup(express());


    beforeEach(function (done) {
        // Reset DB every time to get test a reproducable state
        request(app).get('/init').expect(200, done);

    });


    it('After correct auth user core data sent to the user', function (done) {
        request(app)
            .post('/auth/login').send({
                username: 'aschmidt',
                password: 'prodyna'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.userId.should.equal('aschmidt');
                done();
            });


    });

    /*
     it('After authentication failure 401 sent to user', function (done) {
     var server = requireHelper('app');
     var app = server.setup(express());

     request(app)
     .post('/auth/login').send({
     username: 'hacker',
     password: 'prodyna1'
     })
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .expect(401)
     .end(function (err, res) {
     should.exist(err);
     done();
     });

     });
     */

    /**  Fails because passport caches stub somewhere in its implementation and says he is authenticated**/

    /*     it('After authentication failure 401 sent to user', function (done) {
     var security = requireHelper('controller/SecurityController');
     var securityStub = sandbox.stub(security, 'authenticateUser', function (req, username, password, done) {
     // Authentication failed
     done(null, false);
     });

     var supertestserver = request(app);

     supertestserver
     .post('/auth/login').send({
     username: 'mmustermann',
     password: 'prodyna1'
     })
     .set('Accept', 'application/json')
     .expect(401)
     .end(function (err, res) {
     console.info(err);
     should.not.exist(err);

     done();
     });

     });*/

});
