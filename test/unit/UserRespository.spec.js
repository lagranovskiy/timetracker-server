var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../require_helper');
var UserRepository = requireHelper('model/UserRepository');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};



describe('User Repository test', function() {
    var sandbox, repository;

    var testUserData = [{
        user: {
            id: 1234,
            data: {
                uid: 'test',
                passwordMD5: 'qwert'
            }
        },
        Group: 'Testgruppe'
    }];


    beforeEach(function() {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        sandbox.restore();
    });


    describe('Test creation of a new user', function() {

        it('Test if constructor works', function() {
            repository = new UserRepository();
            should(repository == null).eql(false);
        });

        it('Test if create User With Person returns user created by db', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, testUserData);
            });

            repository = new UserRepository();
            repository.createUserWithPerson({}, function(err, createdUser) {
                should(createdUser.getDbId()).be.equal(1234);
                should(createdUser.getUid()).be.equal('test');
                should(createdUser.getPwdHash()).be.equal('qwert');
                done();
            });

        });

        it('Test if error thrown if illegal data count comes from db', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });

            repository = new UserRepository();
            repository.createUserWithPerson({}, function(err, createdUser) {
                should(createdUser).be.equal(undefined);
                should(err).not.be.equal(null);
                done();
            });

        });


        it('Test if create User With Person returns no result (fails)', function(done) {
            var testUserData = [];

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, testUserData);
            });

            repository = new UserRepository();
            repository.createUserWithPerson({}, function(err, createdUser) {
                should(err).be.equal(null);
                should(createdUser).be.equal(false);
                done();
            });

        });


        it('Test if db called with correct attributes', function(done) {
            var testUserData = [{
                user: {
                    id: 1234,
                    data: {
                        uid: 'test',
                        passwordMD5: 'qwert'
                    }
                },
                Group: 'Testgruppe'
            }];

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                should(data).have.property('test1');
                should(data).have.property('test2');
                should(data.test1).be.eql('test');
                should(data.test2).be.eql('test');
                done();
            });

            repository = new UserRepository();
            repository.createUserWithPerson({
                test1: 'test',
                test2: 'test'
            }, function(err, createdUser) {});

        });



    });


    describe('Test finding of user', function() {
        it('Test if db query was called correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                should(data).have.property('userId');
                should(data.userId).be.equal('Tester');
                callback(null, testUserData);
            });


            repository.findUser('Tester', function(err, foundUser) {
                should(foundUser.getDbId()).be.equal(1234);
                should(foundUser.getUid()).be.equal('test');
                should(foundUser.getPwdHash()).be.equal('qwert');
                done();
            });
        });


        it('Test if no result returns if nothing found', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, []);
            });


            repository.findUser('Tester', function(err, foundUser) {
                should(err).be.equal(null);
                should(foundUser).be.equal(false);
                done();
            });
        });

        it('Test if error thrown if more then one user found', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            repository.findUser('Tester', function(err, foundUser) {
                should(foundUser).be.equal(undefined);
                should(err).not.be.equal(null);
                done();
            });
        });
    });


    describe('Test resolving of existing user', function() {

        it('Test if db returned user was filled correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {

                should(data).have.property('uid');
                should(data.uid).be.equal('Tester');

                var resolvedUser = [{
                    user: testUserData[0].user,
                    MainGroup: 'User',
                    OtherGroups: 'Manager,Admin'
                }];
                callback(null, resolvedUser);
            });

            repository.getUser('Tester', function(err, foundUser) {
                should(foundUser.getDbId()).be.equal(1234);
                should(foundUser.getUid()).be.equal('test');
                should(foundUser.getPwdHash()).be.equal('qwert');

                should(foundUser.getGroups().length).be.equal(3);
                should(foundUser.getGroups()[0]).be.equal('User');
                should(foundUser.getGroups()[1]).be.equal('Manager');
                should(foundUser.getGroups()[2]).be.equal('Admin');

                done();
            });
        });

        it('Test if false returned if no user found', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, []);
            });

            repository.getUser('Tester', function(err, foundUser) {
                should(err).be.equal(null);
                should(foundUser).be.equal(false);
                done();
            });
        });


        it('Test if error thrown if more then one user found', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            repository.getUser('Tester', function(err, foundUser) {
                should(foundUser).be.equal(undefined);
                should(err).not.be.equal(null);
                done();
            });
        });

    });


});