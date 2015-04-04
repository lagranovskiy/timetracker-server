var project = require('../controller/Project');
var person = require('../controller/Person');
var bookings = require('../controller/Bookings');
var security = require('../controller/Security');
var data = require('../controller/Data');
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
        res.header('Access-Control-Allow-Origin', config.clientHost);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    //DANEGER: Temp data pumping ONLY for DEV
    app.get('/init', data.reinitDB);


    /**
     * Security Auth Methods
     */
    app.post('/auth/login', passport.authenticate('local'), security.sendAuthData);
    app.get('/auth', isLoggedIn, security.sendAuthData);
    app.post('/auth/logout', security.logout);
    app.post('/auth/sign', passport.authenticate('localsign'), security.sendAuthData);


    /**
     * CRUD Methods for project entity
     */
    app.get('/person/', isLoggedIn, person.listPersons);
    //app.put('/person/:projectId', isLoggedIn, person.savePerson);
    //app.post('/person/', isLoggedIn, person.createPerson);
    //app.delete('/person/:projectId', isLoggedIn, person.deletePerson);


    /**
     * CRUD Methods for project entity
     */
    app.get('/project/', isLoggedIn, project.listProjects);
    app.put('/project/:projectId', isLoggedIn, project.saveProject);
    app.post('/project/', isLoggedIn, project.createProject);
    app.delete('/project/:projectId', isLoggedIn, project.deleteProject);

    /**
     * Business methods for project entity
     */
    app.get('/project/:projectId/statistics', isLoggedIn, project.projectStatistic);
    app.get('/project/:projectId/bookings', isLoggedIn, project.projectBookings);
    app.get('/project/:projectId/resources', isLoggedIn, project.projectResources);


    /**
     * CRUD Methods for booking entity
     */
    app.get('/booking/', isLoggedIn, bookings.listBookings);
    app.put('/booking/:bookingId', isLoggedIn, bookings.saveBooking);
    app.post('/booking/', isLoggedIn, bookings.createBooking);
    app.delete('/booking/:bookingId', isLoggedIn, bookings.deleteBooking);


    /**
     * Business methods misc
     */
    app.get('/user/check/:userId', person.checkUsernameExists);
    app.get('/user/bookings', isLoggedIn, bookings.listUserBookings);
    app.get('/user/project/:projectId/bookings', isLoggedIn, bookings.listUserProjectBookings);
    app.get('/user/projects', isLoggedIn, project.listVisibleProjects);
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