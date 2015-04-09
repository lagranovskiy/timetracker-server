process.env.NODE_ENV = 'test';

var request = require('supertest'),
    should = require('should'),
    express = require('express');
var requireHelper = require('../require_helper');
var projectController = requireHelper('controller/ProjectController');
var config = requireHelper('./config/config');

describe('request.agent(app)', function() {
    var app = express();
    var agent = request.agent(app);


    app.get('/project/', projectController.listProjects);
    app.put('/project/:projectId', projectController.saveProject);
    app.post('/project/', projectController.createProject);
    app.delete('/project/:projectId', projectController.deleteProject);
    app.get('/project/:projectId/statistics', projectController.projectStatistic);
    app.get('/project/:projectId/bookings', projectController.projectBookings);
    app.get('/project/:projectId/resources', projectController.projectResources);


    it('list all projects returns 200', function(done) {
        // the request-object is the supertest top level api
        request(app)
            .get('/project')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done); // note that we're passing the done as parameter to the expect
    });

});