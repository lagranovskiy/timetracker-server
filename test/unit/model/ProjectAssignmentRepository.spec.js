var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../../require_helper');
var ProjectAssignmentRepository = requireHelper('model/ProjectAssignmentRepository');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};

describe('Project Assignment Repository test', function () {
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
        },
        role: {
            id: 1234,
            data: {
                role: 'Architect'
            }
        }
    }];


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test crud of a project assignments', function () {

        it('Test if constructor works', function () {
            repository = new ProjectAssignmentRepository();
            should(repository == null).eql(false);
        });


        it('Test projects of person resolved correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testProjectData);
            });

            repository = new ProjectAssignmentRepository();
            repository.listProjectsOfPerson(100, function (err, personProjects) {
                should(personProjects.length).be.equal(1);
                done();
            });

        });

        it('Test projects can be assigned to the user correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    person: {id: 160},
                    r: {id: 166, data: {role: 'Architect'}},
                    project: {id: 165}
                }]);
            });

            repository = new ProjectAssignmentRepository();
            repository.updateAssignment(100, 150, 'Architect', function (err, assignment) {
                should.not.exist(err);
                should.exist(assignment);
                should(assignment.assignmentId).be.equal(166);
                should(assignment.personId).be.equal(160);
                should(assignment.projectId).be.equal(165);
                should(assignment.role).be.equal('Architect');
            });

            repository.updateAssignment(null, null, null, function (err, assignment) {
                should.exist(err);
            });

            repository.updateAssignment(150, null, null, function (err, assignment) {
                should.exist(err);
            });

            repository.updateAssignment(150, 160, null, function (err, assignment) {
                should.exist(err);
            });
            done();

        });


        it('Test projects can be unassigned from the user correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    person: {id: 160},
                    project: {id: 165}
                }]);
            });

            repository = new ProjectAssignmentRepository();
            repository.deleteAssignment(100, function (err, assignment) {
                should.not.exist(err);
                should.exist(assignment);
                should(assignment.assignmentId).be.equal(166);
                should(assignment.personId).be.equal(160);
                should(assignment.projectId).be.equal(165);
            });

            repository.deleteAssignment(null, function (err, assignment) {
                should.exist(err);
            });


            done();

        });


    });

});