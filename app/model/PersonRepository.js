var async = require('async'),
    Person = require('./Person'),
    Project = require('./Project'),
    _ = require('underscore'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase(config.db.url);

function PersonRepository() {}

/*
 * Returns a list of all person objects saved in system
 */
PersonRepository.prototype.listAllPersons = function(retValCallback) {
    var query = [
            "MATCH (person:Person)",
            "RETURN person"
        ]
        .join('\n');

    async.waterfall([
        function(callback) {
            db.query(query, {}, callback);
        },
        function(results, callback) {
            var personList = [];
            _.each(results, function(person) {
                personList.push(new Person(person.id, person.data));
            });

            retValCallback(null, personList);
        }
    ]);
};



module.exports = PersonRepository;