var project = require('../controller/Project');
var passport = require('passport');

module.exports = function (app, passport) {

    // default route
    app.route('/').get(function (req, res, next) {
        res.send(200, 'PAC timetracker3')
    });


    // process the signup form
    app.post('/login', passport.authenticate('local-signup'), function(err, user, info){
        console.error('Hahahaa, Hoooo, Huuuu');
    });


    app.post('/ldogin',
        passport.authenticate('local'), function (req, res) {
            req.send(200, 'Hello');
        }
    );

    app.get('/projects/visible', isLoggedIn, project.listVisibleProjects);
    app.get('/projects/', isLoggedIn, project.listAllProjects);
    app.put('/project/:projectId', isLoggedIn, project.saveProject);
    app.post('/project/:projectId', isLoggedIn, project.createNewProject);
    app.delete('/project/:projectId', isLoggedIn, project.deleteProject);


    /**
     * Function that checks if user is logged in
     */
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

};