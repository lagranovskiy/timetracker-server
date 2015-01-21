var express = require('express'),
    request = require('supertest'),
    nock = require('nock'),
    server = request.agent("http://localhost:8484");
var should = require('should');
var requireHelper = require('../require_helper');
var security = requireHelper('controller/Security');
var User = requireHelper('./model/User');

describe('security controller', function() {

    describe('Sign up functionality works correctly', function() {

        it('Sends authentication information to the user', function(done) {

            server
                .post('/auth/login').send({
                    username: 'mmustermann',
                    password: 'prodyna'
                })
                .expect(200, done)
                .expect('Content-Type', /json/);

            var userData = {
                data: {}
            };



        });
    });


});