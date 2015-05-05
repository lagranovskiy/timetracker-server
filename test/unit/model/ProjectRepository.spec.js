var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var requireHelper = require('../../require_helper');
var ProjectRepository = requireHelper('model/ProjectRepository');
var Project = requireHelper('model/Project');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};

describe('Project Repository test', function() {
    var sandbox, repository;

    var testProjectData = [{
        project: {
            id: 1234,
            data: {
                projectName: 'NABUCCO',
                projectId: 'E123',
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


    describe('Test crud of a projects', function() {

        it('Test if constructor works', function() {
            repository = new ProjectRepository();
            should(repository == null).eql(false);
        });


        it('Test if listing of all projects works', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                callback(null, testProjectData);
            });

            repository = new ProjectRepository();
            repository.listAllProjects(function(err, personProjects) {
                should(personProjects.length).be.equal(1);
                done();
            });

        });

        /*
                it('Test if create new Project works correctly', function(done) {
                    sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                        callback(null, testProjectData);
                    });

                    repository = new ProjectRepository();
                    repository.createNewProject(testProjectData[0].project.data, function(err, createdProject) {
                            should(createdProject.getId()).be.equal(1234);
                        should(createdProject.getProjectName()).be.equal('NABUCCO');
                        should(createdProject.getCustomerName).be.equal('PRODYNA');
                        done();
                    });

                });
        */
        it('Test if illegal return value by creating of new Project throws exception correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                var illegalData = [];
                illegalData.push(testProjectData[0]);
                illegalData.push(testProjectData[0]);
                callback(null, illegalData);
            });

            repository = new ProjectRepository();
            repository.createNewProject(testProjectData[0].project.data, function(err, createdProject) {
                should.exist(err);
                should(createdProject).be.equal(undefined);
                done();
            });

        });

        it('Test if project can be saved correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                should(data.projectId).be.equal(1234);
                should(data.projectData.projectName).be.equal('NABUCCO');
                callback(null, testProjectData);
            });

            repository = new ProjectRepository();
            var project = new Project(1234, testProjectData[0].project.data);
            repository.saveProject(1234, project, function(err, savedProject) {
                should(savedProject).not.be.equal(undefined);
                done();
            });

        });

        it('Test if illegal response by project saving handled correctly', function(done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function(query, data, callback) {
                var illegalData = [];
                illegalData.push(testProjectData[0]);
                illegalData.push(testProjectData[0]);
                callback(null, illegalData);
            });

            repository = new ProjectRepository();
            repository.saveProject(1234, testProjectData[0].project.data, function(err, savedProject) {
                should.exist(err);
                should(savedProject).be.equal(undefined);
                done();
            });

        });


        it('Test if project is deleted successful', function(done) {
            var relation = {
                id: null,
                data: {},
                save: function(cb) {
                    cb(null, this);
                }
            };
            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function(id, callback) {
                should(id).be.equal(1234);
                relation.id = id;
                callback(null, relation);
            });

            repository = new ProjectRepository();
            repository.deleteProject(1234, function(err, projectRemoved) {
                should(projectRemoved).be.equal('ok');

                done();
            });

        });

        it('Test if illegal response by project deleting handled correctly', function(done) {
            var relation = {
                id: null,
                data: {},
                save: function(cb) {
                    cb(null, this);
                }
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function(id, callback) {
                should(id).be.equal(1234);
                relation.id = id;
                callback(null, relation);
            });



            repository = new ProjectRepository();
            repository.deleteProject(1234, function(err, projectRemoved) {
                should.not.exist(err);
                should(projectRemoved).be.equal("ok");
                done();
            });

        });


    });

});