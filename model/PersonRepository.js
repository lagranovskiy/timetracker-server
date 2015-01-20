var async = require('async'),
    Person = require('./Person'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

