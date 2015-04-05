var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../require_helper');
var PersonRepository = requireHelper('model/PersonRepository');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};


describe('Project Repository test', function() {
    var sandbox, repository;

    var testPersonData = [{
        person: {
            id: 100,
            data: {
                forename: 'Test',
                surname: 'Tester',
                birthday: 1599855100,
                email: 'test@prodyna.com',
                phone: '12345'
            }
        }
    }];


    beforeEach(function() {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        sandbox.restore();
    });


    describe('Test creation of a new user', function() {

        it('Test if constructor works', function() {
            repository = new PersonRepository();
            should(repository == null).eql(false);
        });


        it('Test projects of person resolved correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, testPersonData);
            });

            repository = new PersonRepository();
            repository.listPersons(function(err, persons) {
                should(persons.length).be.equal(1);
                done();
            });

        });


    });

});