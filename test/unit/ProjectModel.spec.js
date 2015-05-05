var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var md5 = require('MD5');
var requireHelper = require('../require_helper');
var ProjectModel = requireHelper('model/ProjectModel');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};


describe('ProjectModel test', function () {
    var sandbox, projectModel;

    beforeEach(function () {
        projectModel = new ProjectModel();
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test Projects model', function () {

        it('Test if constructor works', function () {
            should(projectModel == null).eql(false);
        });

        it('Test if listing of visible projects returns them', function (done) {
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

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testProjectData);
            });

            projectModel.listVisibleProjects(1500, function (err, projectList) {
                should.not.exist(err);
                should.exist(projectList);
                should(projectList[0].id).be.equal(1234);
                done();
            });

        });

        it('Test if listing of all projects returns them', function (done) {
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

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testProjectData);
            });

            projectModel.listProjects(function (err, projectList) {
                should.not.exist(err);
                should.exist(projectList);
                should(projectList[0].id).be.equal(1234);
                done();
            });

        });


        it('Test resolving of project resources works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    personId: 100,
                    projectId: 100,
                    assignment: {id: 100, data: {created: 1345667677}},
                    role: {id: 150, data: {role: 'Architect'}}
                }]);
            });

            projectModel.projectResources(1500, function (err, resourcesList) {
                should.not.exist(err);
                should.exist(resourcesList);
                should(resourcesList[0].personId).be.equal(100);
                done();
            });

        });

        it('Test resolving of project bookings works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    userId: 100,
                    booking: {id: 100, data: {created: 1345667677}},
                    person: {id: 150}
                }]);
            });

            projectModel.projectBookings(1500, function (err, resourcesList) {
                should.not.exist(err);
                should.exist(resourcesList);
            });
            projectModel.projectBookings(null, function (err, resourcesList) {
                should.exist(err);
            });

            done();

        });


        it('Test creating of a new project works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    project: {
                        id: 1500,
                        data: {
                            projectId: 'ER106',
                            projectName: 'OASISy',
                            description: 'Interesting esb project',
                            customerName: 'SAS',
                            projectType: 'TM',
                            projectStart: 1429021600000,
                            projectEnd: 1432850400000,
                            projectResponsible: 'Baston Bicke'
                        }
                    }
                }]);
            });

            var projectData = {
                id: null,
                projectId: 'ER106',
                projectName: 'OASISy',
                description: 'Interesting esb project',
                customerName: 'SAS',
                projectType: 'TM',
                projectStart: 1429021600000,
                projectEnd: 1432850400000,
                projectResponsible: 'Baston Bicke'
            };

            projectModel.createNewProject(projectData, function (err, project) {
                should.not.exist(err);
                should.exist(project);
                should(project.id).be.equal(1500);
            });

            projectModel.createNewProject(null, function (err, project) {
                should.exist(err);
            });

            projectModel.createNewProject({id: 15}, function (err, project) {
                should.exist(err);
            });

            done();

        });

        it('Test validation of a project works', function (done) {

            var projectData = {
                id: null,
                projectId: null,
                projectName: null,
                description: null,
                customerName: null,
                projectType: null,
                projectStart: null,
                projectEnd: null,
                projectResponsible: null
            };

            projectModel.createNewProject(projectData, function (err, project) {
                should.exist(err);
            });

            done();

        });


        it('Test saving of a project works', function (done) {
            var projectData = {
                id: 1500,
                projectId: 'ER106',
                projectName: 'OASISy',
                description: 'Interesting esb project',
                customerName: 'SAS',
                projectType: 'TM',
                projectStart: 1429021600000,
                projectEnd: 1432850400000,
                projectResponsible: 'Baston Bicke'
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    project: {
                        id: 1500,
                        data: {
                            projectId: 'ER106',
                            projectName: 'OASISy',
                            description: 'Interesting esb project',
                            customerName: 'SAS',
                            projectType: 'TM',
                            projectStart: 1429021600000,
                            projectEnd: 1432850400000,
                            projectResponsible: 'Baston Bicke'
                        }
                    }
                }]);
            });


            projectModel.saveProject(1500, projectData, function (err, project) {
                should.not.exist(err);
                should.exist(project);
                should(project.id).be.equal(1500);
            });

            projectModel.saveProject(null, null, function (err, project) {
                should.exist(err);
            });
            done();


        });


        it('Test deleting of a project works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (nodeid, callback) {
                callback(null, {
                        id: 1500,
                        data: {
                            projectId: 'ER106',
                            projectName: 'OASISy',
                            description: 'Interesting esb project',
                            customerName: 'SAS',
                            projectType: 'TM',
                            projectStart: 1429021600000,
                            projectEnd: 1432850400000,
                            projectResponsible: 'Baston Bicke'
                        },
                        save: function (callback) {
                            callback(null, this);
                        }
                    }
                );
            });


            projectModel.deleteProject(1500, function (err, result) {
                should.not.exist(err);
                should.exist(result);
                should(result).be.equal('ok');
            });

            projectModel.deleteProject(null, function (err, project) {
                should.exist(err);
            });


            done();

        });

        it('Test resolving of project resources throws exception by null', function (done) {

            projectModel.projectResources(null, function (err, resourcesList) {
                should.exist(err);
                done();
            });

        });


        it('Test if project stats works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, [{
                    ResourceCount: 15,
                    BookingsCount: 150,
                    BookedTime: 129,
                    BookedPause: 50
                }]);
            });

            projectModel.projectStatistic(15, function (err, stat) {
                should.not.exist(err);
                should.exist(stat);
                done();
            });

        });


    });

});