var config = require('./config/config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var later = require('later');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// configuration
require('./config/express')(app, config);

// load routes
require('./config/routes')(app);

app.listen(config.port);

console.log('Timetracker server started successfully')
