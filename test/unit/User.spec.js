var sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var User = requireHelper('model/User');

describe('User Model test', function() {

    describe('Test User Model API', function() {
        var sandbox, user;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            user = new User(1234, {
                uid: 'test',
                passwordMD5: 'qwert'
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Test if user returns its data correctly as given from DB', function() {
            should(user.id).be.equal(1234);
            should(user.uid).be.equal('test');
            should(user.passwordMD5).be.equal('qwert');
        });

        it('Test if groups can be added and resolved corectly', function() {
            user.groups.push('Test');
            user.groups.push('Test2');

            should(user.groups.length).be.equal(2);
            should(user.groups[0]).be.equal('Test');
            should(user.groups[1]).be.equal('Test2');
        });

        it('Test if data can be read again', function() {
            should(user.data).have.property('passwordMD5', 'qwert');
            should(user.data).have.property('uid', 'test');
        });
    });


});