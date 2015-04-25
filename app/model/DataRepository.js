var async = require('neo-async'),
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
DataRepository.prototype.importData = function (retValCallback) {

    var query = [
        'CREATE (project1:Project{projectId:\'ER100\', projectName:\'NABUCCO Test Automation\', customerName:\'PRODYNA AG\', projectStart: 1429221600000, projectEnd: 1432850400000, projectResponsible: \'Kolet Kontocho\',projectType:\'TM\', description:\'Interesting project\'})',
        'CREATE (project2:Project{projectId:\'ER101\', projectName:\'NABUCCO HR\', customerName:\'PRODYNA AG\', projectStart: 1429221600000, projectEnd: 1432850400000, projectResponsible: \'Geno Diemens\',projectType:\'FP\',description:\'Interesting project\'})',
        'CREATE (project3:Project{projectId:\'ER102\', projectName:\'NABUCCO Groupware\', customerName:\'PRODYNA AG\',projectStart: 1489221600000, projectEnd: 1492850400000, projectResponsible: \'Jens Weimar\',projectType:\'TM\', description:\'Interesting project\'})',
        'CREATE (project4:Project{projectId:\'ER103\', projectName:\'NABUCCO Meeting\', customerName:\'PRODYNA AG\',projectStart: 1449221600000, projectEnd: 1472850400000, projectResponsible: \'Leopold Maisel\',projectType:\'FP\', description:\'Interesting project\'})',
        'CREATE (project5:Project{projectId:\'ER104\', projectName:\'PDCUBE\', customerName:\'PRODYNA AG\',projectStart: 1419221600000, projectEnd: 1432850400000, projectResponsible: \'Gurke Schmidt\',projectType:\'TM\', description:\'Interesting bi project\'})',
        'CREATE (project6:Project{projectId:\'ER105\', projectName:\'AIDA\', customerName:\'Lufthansa\',projectStart: 1829221600000, projectEnd: 1932850400000, projectResponsible: \'Kollen Mirel\',projectType:\'TM\', description:\'Interesting esb project\'})',
        'CREATE (project7:Project{projectId:\'ER106\', projectName:\'OASISy\', customerName:\'SAS\',projectStart: 1429021600000, projectEnd: 1432850400000, projectResponsible: \'Baston Bicke\',projectType:\'TM\', description:\'Interesting esb project\'})',
        'CREATE (person1:Person{forename:\'Max\', surname:\'Mustermann\', birthday:601555591222, email:\'mm@gmx.de\', phone:\'0176/992773\'})',
        'CREATE (person2:Person{forename:\'Michael\', surname:\'Döner\', birthday:621555591222, email:\'mm2@gmx.de\', phone:\'0176/992772\'})',
        'CREATE (person3:Person{forename:\'Alice\', surname:\'Schmidt\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person4:Person{forename:\'Mischa\', surname:\'Dombrowsky\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person5:Person{forename:\'David\', surname:\'Bero\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person6:Person{forename:\'Daniel\', surname:\'Keller\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/996271\'})',
        'CREATE (person7:Person{forename:\'Dorechy\', surname:\'Schmidt\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person8:Person{forename:\'Tolend\', surname:\'Mancho\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person9:Person{forename:\'Tim\', surname:\'Agranovskiy\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/292771\'})',
        'CREATE (person10:Person{forename:\'Leo\', surname:\'Agranovskiy\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/992771\'})',
        'CREATE (person11:Person{forename:\'Paul\', surname:\'Agranovskiy\', birthday:641555591222, email:\'mm3@gmx.de\', phone:\'0176/792771\'})',
        'CREATE (user1:User{uid:\'mmustermann\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:\'1429910158152\'})',
        'CREATE (user2:User{uid:\'mdoener\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user3:User{uid:\'aschmidt\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user4:User{uid:\'mdobro\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user5:User{uid:\'dbero\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user6:User{uid:\'dkeller\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user7:User{uid:\'dschmidt\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user8:User{uid:\'rmachno\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user9:User{uid:\'tagranovskiy\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user10:User{uid:\'lagranovskiy\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (user11:User{uid:\'pagranovskiy\', passwordMD5:\'20a2c4d8879bf49f232c06769b1612da\', registrationDate:1429910158152})',
        'CREATE (group1:UserGroup{name:\'User\', description:\'Normal user\'})',
        'CREATE (group2:UserGroup{name:\'Manager\', description:\'Manager can assign projects\'})',
        'CREATE (group3:UserGroup{name:\'Admin\', description:\'Can do full application administration\'})',
        'CREATE (group2)-[:PART_OF]->(group1)',
        'CREATE (group3)-[:PART_OF]->(group2)',
        'CREATE (user1)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user2)-[:AUTHORIZED_AS]->(group2)',
        'CREATE (user3)-[:AUTHORIZED_AS]->(group3)',
        'CREATE (user4)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user5)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user6)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user7)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user8)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user9)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user10)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user11)-[:AUTHORIZED_AS]->(group1)',
        'CREATE (user1)-[:HAS_PROFILE]->(person1)',
        'CREATE (user2)-[:HAS_PROFILE]->(person2)',
        'CREATE (user3)-[:HAS_PROFILE]->(person3)',
        'CREATE (user4)-[:HAS_PROFILE]->(person4)',
        'CREATE (user5)-[:HAS_PROFILE]->(person5)',
        'CREATE (user6)-[:HAS_PROFILE]->(person6)',
        'CREATE (user7)-[:HAS_PROFILE]->(person7)',
        'CREATE (user8)-[:HAS_PROFILE]->(person8)',
        'CREATE (user9)-[:HAS_PROFILE]->(person9)',
        'CREATE (user10)-[:HAS_PROFILE]->(person10)',
        'CREATE (user11)-[:HAS_PROFILE]->(person11)',
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
        'CREATE (person4)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project6)',
        'CREATE (person5)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project4)',
        'CREATE (person6)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project3)',
        'CREATE (person7)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project2)',
        'CREATE (person8)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project6)',
        'CREATE (person9)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project7)',
        'CREATE (person10)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project4)',
        'CREATE (person11)-[:HAS_ROLE]->(:Role {role:\'Java Consultant\'})-[:ON_PROJECT]->(project2)'
    ].join('\n');


    async.waterfall([

        function (callback) {
            db.query(query, {}, callback);
        }

    ], function (err, data) {
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
DataRepository.prototype.removeAllData = function (retValCallback) {

    var queryArray = [
        'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r;'
    ];


    async.each(queryArray, function (query, callback) {
        db.query(query, {}, function (err, data) {
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