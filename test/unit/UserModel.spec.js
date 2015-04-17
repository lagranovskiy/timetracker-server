var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../require_helper');
var UserModel = requireHelper('model/UserModel');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};


describe('User Repository test', function () {
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


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test creation of a new user', function () {

        it('Test if constructor works', function () {
            repository = new UserModel();
            should(repository == null).eql(false);
        });

        it('Test if create User With Person returns user created by db', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testUserData);
            });

            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            repository = new UserModel();
            repository.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
                should.not.exist(err);
                should(createdUser.id).be.equal(1234);
                should(createdUser.uid).be.equal('test');
                should(createdUser.passwordMD5).be.equal('secure');
                done();
            });

        });

        it('Test if error thrown if illegal data count comes from db', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            repository = new UserModel();
            repository.createUserWithPerson('test', 'prodyna',testData, function (err, createdUser) {
                should(createdUser).be.equal(undefined);
                should.exist(err);
                done();
            });

        });


        it('Test if create User With Person returns no result (fails)', function (done) {
            var testUserData = [];
            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testUserData);
            });

            repository = new UserModel();
            repository.createUserWithPerson('test', 'prodyna',testData, function (err, createdUser) {
                should.not.exist(err);
                should(createdUser).be.equal(false);
                done();
            });

        });


        it('Test if db called with correct attributes', function (done) {
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
            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('forename');
                should(data).have.property('surname');
                should(data.forename).be.eql('Test');
                should(data.surname).be.eql('Test');
                done();
            });

            repository = new UserModel();
            repository.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
            });

        });


    });


    describe('Test finding of user', function () {
        it('Test if db query was called correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uid');
                should(data.uid).be.equal('Tester');
                callback(null, testUserData);
            });


            repository.findUser('Tester', function (err, foundUser) {
                should(foundUser.id).be.equal(1234);
                should(foundUser.uid).be.equal('test');
                should(foundUser.passwordMD5).be.equal('secure');
                done();
            });
        });


        it('Test if no result returns if nothing found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, []);
            });


            repository.findUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser).be.equal(false);
                done();
            });
        });

        it('Test if error thrown if more then one user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            repository.findUser('Tester', function (err, foundUser) {
                should(foundUser).be.equal(undefined);
                should.exist(err);
                done();
            });
        });
    });


    describe('Test resolving of existing user', function () {

        it('Test if db returned user was filled correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {

                should(data).have.property('uid');
                should(data.uid).be.equal('Tester');

                var resolvedUser = [{
                    user: testUserData[0].user,
                    MainGroup: 'User',
                    OtherGroups: 'Manager,Admin'
                }];
                callback(null, resolvedUser);
            });

            repository.resolveUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser.id).be.equal(1234);
                should(foundUser.uid).be.equal('test');
                should(foundUser.passwordMD5).be.equal('secure');

                should(foundUser.groups.length).be.equal(3);
                should(foundUser.groups[0]).be.equal('User');
                should(foundUser.groups[1]).be.equal('Manager');
                should(foundUser.groups[2]).be.equal('Admin');

                done();
            });
        });

        it('Test if false returned if no user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, []);
            });

            repository.resolveUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser).be.equal(false);
                done();
            });
        });


        it('Test if error thrown if more then one user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            repository.findUser('Tester', function (err, foundUser) {
                should(foundUser).be.equal(undefined);
                should.exist(err);
                done();
            });
        });

    });


});