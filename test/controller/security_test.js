var request = require('supertest'),
    express = require('express'),
    sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var security = requireHelper('controller/Security');



describe('security controller', function() {

    describe('Sign up functionality works correctly', function() {

        it('Sends authentication information to the user', function(done) {

            var securityStub = sinon.stub(security, 'sendAuthData', function(req, res) {
                res.status(200).json({
                    id: 123,
                    userId: 'tester',
                    groups: ['User'],
                    session: 'oijdowiedewoidwed'
                });
            });

            var userSecurityStub = sinon.stub(security, 'authenticateUser', function(req, username, password, done) {
                done(null, {
                    getUid: function() {
                        return 'tester';
                    }
                });
            });

            var supertestserver = request(requireHelper('app'));

            supertestserver
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

            var userData = {
                data: {}
            };

            securityStub.restore();


        });
    });


});