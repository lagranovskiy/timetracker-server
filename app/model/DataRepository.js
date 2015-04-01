var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    _ = require('underscore'),
    db = new neo4j.GraphDatabase(config.db.url);

function DataRepository() {

}


/**
 * DataRepository.prototype.importData - Imorts a defaule dataset
 *
 * @param  {type} retValCallback description
 * @return {type}                description
 */
DataRepository.prototype.importData = function(retValCallback) {

    var query = [
        'CREATE (project1:Project{projectId:\'ER100\', projectName:\'NABUCCO Test Automation\', customerName:\'PRODYNA AG\', description:\'Interesting project\'})',
        'CREATE (project2:Project{projectId:\'ER101\', projectName:\'NABUCCO HR\', customerName:\'PRODYNA AG\', description:\'Interesting project\'})',
        'CREATE (project3:Project{projectId:\'ER102\', projectName:\'NABUCCO Groupware\', customerName:\'PRODYNA AG\', description:\'Interesting project\'})',
        'CREATE (project4:Project{projectId:\'ER103\', projectName:\'NABUCCO Meeting\', customerName:\'PRODYNA AG\', description:\'Interesting project\'})',
        'CREATE (project5:Project{projectId:\'ER104\', projectName:\'PDCUBE\', customerName:\'PRODYNA AG\', description:\'Interesting bi project\'})',
        'CREATE (project6:Project{projectId:\'ER105\', projectName:\'AIDA\', customerName:\'Lufthansa\', description:\'Interesting esb project\'})',
        'CREATE (project7:Project{projectId:\'ER106\', projectName:\'OASISy\', customerName:\'SAS\', description:\'Interesting esb project\'})',
        'CREATE (person1:Person{forename:\'Max\', surname:\'Mustermann\', birthday:\'18.09.1950\', email:\'mm@gmx.de\', phone:\'0176/992773\'})',
        'CREATE (person2:Person{forename:\'Michael\', surname:\'Döner\', birthday:\'18.10.1970\', email:\'mm2@gmx.de\', phone:\'0176/992772\'})',
        'CREATE (person3:Person{forename:\'Alice\', surname:\'Schmidt\', birthday:\'18.09.1930\', email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (user1:User{uid:\'mmustermann\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:\'01.01.2000\'})',
        'CREATE (user2:User{uid:\'mdoener\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:\'01.01.2003\'})',
        'CREATE (user3:User{uid:\'aschmidt\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:\'01.01.2004\'})',
        'CREATE (group1:UserGroup{name:\'User\', description:\'Normal user\'})',
        'CREATE (group2:UserGroup{name:\'Manager\', description:\'Manager can assign projects\'})',
        'CREATE (group3:UserGroup{name:\'Admin\', description:\'Can do full application administration\'})',
        'CREATE (group2)-[:PART_OF]->(group1)',
        'CREATE (group3)-[:PART_OF]->(group2)',
        'CREATE (user1)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user2)-[:AUTHORIZED_AS]->(group2)',
        'CREATE (user3)-[:AUTHORIZED_AS]->(group3)',
        'CREATE (user1)-[:HAS_PROFILE]->(person1)',
        'CREATE (user2)-[:HAS_PROFILE]->(person2)',
        'CREATE (user3)-[:HAS_PROFILE]->(person3)',

        'CREATE (person1)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project1)',
        'CREATE (person1)-[:HAS_ROLE]->(:Role {role:\'QA\'})-[:ON_PROJECT]->(project2)',
        'CREATE (person1)-[:HAS_ROLE]->(:Role {role:\'Tester\'})-[:ON_PROJECT]->(project3)',
        'CREATE (person1)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project4)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project5)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Architect\'})-[:ON_PROJECT]->(project6)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project7)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project2)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Architect\'})-[:ON_PROJECT]->(project3)',
        'CREATE (person2)-[:HAS_ROLE]->(:Role {role:\'Tester\'})-[:ON_PROJECT]->(project1)',
        'CREATE (person3)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project1)',
        'CREATE (person3)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project4)',
        'CREATE (person3)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project5)',
        'CREATE (person3)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project6)',
        'CREATE (person3)-[:HAS_ROLE]->(:Role {role:\'Developer\'})-[:ON_PROJECT]->(project7)',
        'CREATE (person1)-[:HAS_ROLE]->(:Role {role:\'Consultant\'})-[:ON_PROJECT]->(project7)',
        'CREATE (person3)-[:IS_TEAM_MEMBER{role:\'3rd level support\'}]->(project1);'
    ].join('\n');



    async.waterfall([

        function(callback) {
            db.query(query, {}, callback);
        }

    ], function(err, data) {
        console.info('Execution of query: ' + query);
        if (err) {
            return console.error('Failed ' + err);
        }
        console.error('Success');

        return retValCallback(err, true);
    });

};




/**
 * DataRepository.prototype.removeAllData - removes all data
 *
 * @param  {type} retValCallback description
 * @return {type}                description
 */
DataRepository.prototype.removeAllData = function(retValCallback) {

    var queryArray = [
        'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r;'
    ];


    async.each(queryArray, function(query, callback) {
        db.query(query, {}, function(err, data) {
            console.info('Execution of query: ' + query);
            if (err) {
                return console.error('Failed ' + err);
            }
            console.error('Success');

            return callback(err, data);
        });
    }, retValCallback);



};



module.exports = DataRepository;