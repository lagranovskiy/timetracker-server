var project = require('../controller/Project');

module.exports = function (app) {
    // default route
    app.route('/').get(function (req, res, next) {
        res.send(200, 'PAC timetracker3')
    });

    app.get('/projects/visible', project.listVisibleProjects); 
    app.get('/projects/', project.listAllProjects); 
    app.put('/project/:projectId', project.saveProject); 
    app.post('/project/:projectId', project.createNewProject); 
    app.delete('/project/:projectId', project.deleteProject); 
    
};