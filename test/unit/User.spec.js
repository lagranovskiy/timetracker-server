var sinon = require('sinon');
var should = require('should');
var requireHelper = require('../require_helper');
var User = requireHelper('model/User');

describe('User Model test', function() {

    describe('Test User Model API', function() {
        var sandbox, user;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            user = new User({
                id: 1234,
                data: {
                    uid: 'test',
                    passwordMD5: 'qwert'
                }
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Test if user returns its data correctly as given from DB', function() {
            should(user.getDbId()).be.equal(1234);
            should(user.getUid()).be.equal('test');
            should(user.getPwdHash()).be.equal('qwert');
        });

        it('Test if groups can be added and resolved corectly', function() {
            user.addGroup('Test');
            user.addGroup('Test2');

            should(user.getGroups().length).be.equal(2);
            should(user.getGroups()[0]).be.equal('Test');
            should(user.getGroups()[1]).be.equal('Test2');
        });

        it('Test if data can be read again', function() {
            should(user.getData()).have.property('passwordMD5', 'qwert');
            should(user.getData()).have.property('uid', 'test');
        });
    });


});