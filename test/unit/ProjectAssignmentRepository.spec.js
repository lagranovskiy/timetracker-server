var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../require_helper');
var ProjectAssignmentRepository = requireHelper('model/ProjectAssignmentRepository');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};

describe('Project Assignment Repository test', function() {
    var sandbox, repository;

    var testProjectData = [{
        project: {
            id: 1234,
            data: {
                projectName: 'NABUCCO',
                projectID: 'E123',
                customerName: 'PRODYNA',
                description: 'Nabucco Framework'
            }
        }
    }];


    beforeEach(function() {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        sandbox.restore();
    });


    describe('Test crud of a project assignments', function() {

        it('Test if constructor works', function() {
            repository = new ProjectAssignmentRepository();
            should(repository == null).eql(false);
        });


        it('Test projects of person resolved correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, testProjectData);
            });

            repository = new ProjectAssignmentRepository();
            repository.listProjectsOfPerson(100, function(err, personProjects) {
                should(personProjects.length).be.equal(1);
                done();
            });

        });




    });

});