var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../../require_helper');
var AssignmentController = requireHelper('controller/AssignmentController');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};

describe('Project Assignment Repository test', function () {
    var sandbox, controller;

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
        controller = AssignmentController;

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test crud of a project assignments', function () {

        it('Test if constructor works', function () {
            should(controller == null).eql(false);
        });


        it('Test projects can be assigned to the user correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    person: {id: 160},
                    r: {id: 166, data: {role: 'Architect'}},
                    project: {id: 165}
                }]);
            });

            var request = {
                body: [{
                    person: {id: 100},
                    project: {id: 150},
                    role: 'Architect'
                }]
            };
            var response = {
                send: function (data) {
                    should.exist(data);
                }
            };
            var next = {};
            controller.updateAssignments(request, response, next);


            done();

        });


        it('Test projects can be unassigned from the user correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    person: {id: 160},
                    project: {id: 165}
                }]);
            });

            var request = {
                params: {
                    assignmentId: 150
                }
            };
            var response = {
                send: function (data) {
                    should.exist(data);
                }
            };
            var next = {};

            controller.deleteAssignment(request, response, next);

            done();

        });


    });

});