var project = require('../controller/Project');
var person = require('../controller/Person');
var security = require('../controller/Security');
var passport = require('passport');

module.exports = function(app, config, passport) {


    var errorHandler = function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).json({
            text: 'Internal error',
            error: err
        });

    };
    app.use(errorHandler);



    // default route
    app.route('/').get(function(req, res, next) {
        res.send(200, 'PAC timetracker3');
    });

    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });


    // process the signup form
    app.post('/auth/login', passport.authenticate('local'), security.sendAuthData);
    app.get('/auth', isLoggedIn, security.sendAuthData);
    app.post('/auth/logout', security.logout);
    app.post('/auth/signup', passport.authenticate('local-signup'), security.sendAuthData);

    app.get('/projects/visible', isLoggedIn, project.listVisibleProjects);
    app.get('/project/', isLoggedIn, project.listAllProjects);
    app.put('/project/:projectId', isLoggedIn, project.saveProject);
    app.post('/project/:projectId', isLoggedIn, project.createNewProject);
    app.delete('/project/:projectId', isLoggedIn, project.deleteProject);
    //    app.get('/project/:projectId/member', isLoggedIn, project.getMembers);

    //    app.get('/person/:personId', isLoggedIn, person.getPersonData);
    //    app.put('/person/:personId', isLoggedIn, person.updatePersonData);
    //    app.put('/person/:personId/member/:projectId', isLoggedIn, person.saveTeamMembership);
    //    app.delete('/person/:personId/member/:projectId', isLoggedIn, person.removeTeamMembership);

    /**
     * Function that checks if user is logged in
     */
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.send(401);
        }
    }




};