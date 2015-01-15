module.exports = function (app) {

    //app.use(require('../middleware/authentication').authentication);
    
  
    // default route
    app.route('/').get(function (req, res, next) {
        res.send(200, 'PAC timetracker3')
    });

    app.use('/auth', require('../controller/auth').routes);
    app.use('/project', require('../controller/project').routes); 
    
 /*   // public / anonymous routes
    app.use('/anonymous/sessions', require('../controller/session').routes);

    // secured routes
    app.use('/monitoring', require('../controller/monitoring').routes);
    app.use('/planes', require('../controller/planes').routes);
    app.use('/users', require('../controller/users').routes);
    app.use('/reservations', require('../controller/reservation').routes);*/

};