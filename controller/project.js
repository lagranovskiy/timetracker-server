/**
 * Project Controller
 *
 * Controlls project entities
 **/
var express = require('express');
var async = require('async');
var ProjectRepository = require('../model/ProjectRepository');
var projectRepository = new ProjectRepository();

var project = {};
exports = module.exports = project;
project.routes = express.Router();

project.listVisibleProjects = function (req, res, next) {
    
     async.waterfall([
        function (callback) {
            projectRepository.listVisibleProjects('Leonid', callback)
        }
    ], function (err, results) {
         console.info('here');
        if (err) { return next(err); }
        res.send(results);
    });
    
    
    
}

project.listProjects = function (req, res, next) {
    res.json(200, [
        {
            projectId: 100,
            projectName: 'AIDA',
            projectType: 'tm',
            projectStartDate: '01.01.2002',
            projectEndDate: '02.04.2005'
        },
        {
            projectId: 101,
            projectName: 'MOPITI',
            projectType: 'tm',
            projectStartDate: '01.01.2009',
            projectEndDate: '02.04.2015'
        }, {
            projectId: 102,
            projectName: 'LOZYR',
            projectType: 'fixprice',
            projectStartDate: '01.01.2000',
            projectEndDate: '02.04.2005'
        },
    ]);
}

project.getProjectById = function (req, res, newt) {
    res.json(200, {
        projectId: req.param.projectId,
        projectName: 'AIDA',
        projectType: 'tm',
        projectStartDate: '01.01.2002',
        projectEndDate: '02.04.2005',
        salesResponsible: 'Max Mustermann',
        budget: '200000 Euro'
    })
}

/**
  Returns the list of projects
**/
project.routes.get('/', project.listVisibleProjects);

/**
  Returns the list of projects
**/
project.routes.get('/:projectId', project.getProjectById);