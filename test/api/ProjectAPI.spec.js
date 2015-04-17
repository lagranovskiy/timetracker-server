/*jshint expr: true*/
process.env.NODE_ENV = 'test';

var request = require('supertest'),
    async = require('neo-async'),
    should = require('should'),
    express = require('express');
var requireHelper = require('../require_helper');


describe('request.agent(app)', function() {

    var server = require('../../app/app');
    var app = server.setup(express());
    var cookie;


    beforeEach(function(done) {
        request(app)
            .post('/auth/login').send({
                username: 'aschmidt',
                password: 'prodyna'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                res.should.have.status(200);
                cookie = res.headers['set-cookie'];
            });

        // Reset DB every time to get test a reproducable state
        request(app).get('/init').expect(200, done);

    });


    it('list all projects returns 200', function(done) {
        // the request-object is the supertest top level api
        request(app)
            .get('/project')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                (res.body.length).should.be.above(0);
                done();
            });
    });

    it('Test project can be created', function(done) {

        var testProject = {
            id: null,
            projectId: 'Test Project',
            projectName: 'Test Project',
            description: 'Test Project',
            customerName: 'TEST AG',
            projectType: 'TM',
            projectStart: 1433109600000,
            projectEnd: 1464732000000,
            projectResponsible: 'Test Mustermann'
        };


        // the request-object is the supertest top level api
        request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .send(testProject)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                var project = res.body;
                (project.projectId === testProject.projectId).should.be.ok;
                (project.id).should.be.above(0);
                done();
            });

    });


    it('Test project can be updated', function(done) {

        async.waterfall([
            function(callback) {
                request(app)
                    .get('/project')
                    .set('Accept', 'application/json')
                    .set('cookie', cookie)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, response) {
                        var projectList = response.body;
                        (projectList.length).should.be.above(0);
                        callback(null, projectList);
                    });
            },
            function(projectList, callback) {
                var testProject = projectList[0];

                (testProject.id).should.be.above(0);

                testProject.projectId = 'Modify';
                testProject.description = 'Modify';
                testProject.customerName = 'Modify';
                testProject.projectType = 'Modify';
                testProject.projectResponsible = 'Modify';
                testProject.projectStart = 1433109600001;
                testProject.projectEnd = 1433109600001;

                // the request-object is the supertest top level api
                request(app)
                    .put('/project/' + testProject.id)
                    .set('Accept', 'application/json')
                    .set('cookie', cookie)
                    .send(testProject)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        //should.not.exist(err);
                        console.error(err);
                        console.error(res.body);
                        done();
                    });
            }
        ], done);




    });
    /*
            it('Test project can be deleted', function(done) {

            app.delete('/project/:projectId', projectController.deleteProject);

                var testProject = {
                    id: 200822,
                    data: [],
                    projectId: '333',
                    projectName: 'Hoho project',
                    description: 'leo',
                    customerName: 'test',
                    projectType: 'test',
                    projectStart: 1433109600000,
                    projectEnd: 1464732000000,
                    projectResponsible: 'test',
                    createdTime: 1428442427956,
                    lastUpdatedTime: 1428442427956
                };

                // the request-object is the supertest top level api
                request(app)
                    .post('/project')
                    .set('Accept', 'application/json')
                    .send(testProject)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        console.error(err);
                        console.error(res.body);
                        done();
                    });

            });

            it('Test project resources returned correctly', function(done) {
                var testProject = {
                    id: 200822,
                    data: [],
                    projectId: '333',
                    projectName: 'Hoho project',
                    description: 'leo',
                    customerName: 'test',
                    projectType: 'test',
                    projectStart: 1433109600000,
                    projectEnd: 1464732000000,
                    projectResponsible: 'test',
                    createdTime: 1428442427956,
                    lastUpdatedTime: 1428442427956
                };
                //TODO: TBD
                done();
            });

            it('Test project statistics returned correctly', function(done) {
                var testProject = {
                    id: 200822,
                    data: [],
                    projectId: '333',
                    projectName: 'Hoho project',
                    description: 'leo',
                    customerName: 'test',
                    projectType: 'test',
                    projectStart: 1433109600000,
                    projectEnd: 1464732000000,
                    projectResponsible: 'test',
                    createdTime: 1428442427956,
                    lastUpdatedTime: 1428442427956
                };
                //TODO: TBD
                done();

            });

            it('Test project bookings returned correctly', function(done) {
                var testProject = {
                    id: 200822,
                    data: [],
                    projectId: '333',
                    projectName: 'Hoho project',
                    description: 'leo',
                    customerName: 'test',
                    projectType: 'test',
                    projectStart: 1433109600000,
                    projectEnd: 1464732000000,
                    projectResponsible: 'test',
                    createdTime: 1428442427956,
                    lastUpdatedTime: 1428442427956
                };

                //TODO: TBD
                done();

            });*/
});