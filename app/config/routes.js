var projectController = require('../controller/ProjectController');
var personController = require('../controller/PersonController');
var bookingController = require('../controller/BookingController');
var securityController = require('../controller/SecurityController');
var assignmentController = require('../controller/AssignmentController');
var dataController = require('../controller/DataController');
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
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    //DANEGER: Temp data pumping ONLY for DEV
    app.get('/init', dataController.reinitDB);


    /**
     * Security Auth Methods
     */
    app.post('/auth/login', passport.authenticate('local'), securityController.sendAuthData);
    app.get('/auth', isLoggedIn, securityController.sendAuthData);
    app.post('/auth/logout', securityController.logout);
    app.post('/auth/sign', passport.authenticate('localsign'), securityController.sendAuthData);


    /**
     * CRUD Methods for person entity
     */
    app.get('/person/', isLoggedIn, personController.listPersons);
    //app.put('/person/:projectId', isLoggedIn, person.savePerson);
    //app.post('/person/', isLoggedIn, person.createPerson);
    //app.delete('/person/:projectId', isLoggedIn, person.deletePerson);


    /**
     * CRUD Methods for project entity
     */
    app.get('/project/', isLoggedIn, projectController.listProjects);
    app.put('/project/:projectId', isLoggedIn, projectController.saveProject);
    app.post('/project/', isLoggedIn, projectController.createProject);
    app.delete('/project/:projectId', isLoggedIn, projectController.deleteProject);

    /**
     * Business methods for project entity
     */
    app.get('/project/:projectId/statistics', isLoggedIn, projectController.projectStatistic);
    app.get('/project/:projectId/bookings', isLoggedIn, projectController.projectBookings);
    app.get('/project/:projectId/resources', isLoggedIn, projectController.projectResources);


    /**
     * CRUD Methods for booking entity
     */
    app.get('/booking/', isLoggedIn, bookingController.listBookings);
    app.put('/booking/:bookingId', isLoggedIn, bookingController.saveBooking);
    app.post('/booking/', isLoggedIn, bookingController.createBooking);
    app.delete('/booking/:bookingId', isLoggedIn, bookingController.deleteBooking);


    /**
     * CRUD Methods for roles
     */
    app.get('/role/', isLoggedIn, personController.listRoles);

    /**
     * CRUD Methods for assignments
     */
    app.put('/assignment/', isLoggedIn, assignmentController.updateAssignments);
    app.delete('/assignment/:assignmentId', isLoggedIn, assignmentController.deleteAssignment);

    /**
     * Business methods misc
     */
    app.get('/user/check/:userId', personController.checkUsernameExists);
    app.get('/user/bookings', isLoggedIn, bookingController.listUserBookings);
    app.get('/user/project/:projectId/bookings', isLoggedIn, bookingController.listUserProjectBookings);
    app.get('/user/projects', isLoggedIn, projectController.listVisibleProjects);
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