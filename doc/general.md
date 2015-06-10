# General Development Information

## Used technologies (Welche Technologien werden verwendet?)
Following technologies was used in the solution:
* NodeJS / JavaScript
* Neo4j / Cypher
* Redis 
* AMQP (JMS extended)
* WebSockets
* HTML/CSS
* Docker

## Required development skills (Welche Skills sind für die Weiterentwicklung notwendig?)

* JavaScript Frameworks:
  * Mocha
  * AngularJS
  * SocketIO
  * AMQP
* Web Development (AJAX etc)
* Graph Databases like Neo4J
* Redis DB
* Rabbit MQ
* Basics of cryptographie (md5, hash)
* WebSocket

## Sources locations (Wie befinden sich die Sourcen des Systems?)

There are two git repositories of the project:
https://github.com/lagranovskiy/timetracker-server
https://github.com/lagranovskiy/timetracker-client

## Organization of sources (Wie sind die Sourcen organisiert?)

Sources are organized on the following pattern:

root 
  * technical files for 3rd party, version systems (new relic, travis ci, git)
  * build script for test, build and start of the application (Grund)
  * dependency management configurations: package.json, bower.rc
   
app
  * includes the running sources groups by type in folders like controller, model, config etc.

test
  * Tests for the application
  * 
  
## Development Software Kit (Welche Software brauche ich, um entwickeln zu können?)

* Docker (docker.io)
* Docker images for Redis, Neo4j, RebbitMQ
* Eclipse / Intellij / Atom.io or other js complient editor
* node, grunt-cli and npm in the in package json defined versions

##Naming Convention

There are follofing filename conventions:
* Controllers: xxxController.js
* Model: xxxModel.js
* Entity: xxx.js

##Standards for Code Style

As a standard for code style jshint is used. The settings set for it is defined in jshint file in root of the project. 

```
{
    "node": true,
    "browser": false,
    "bitwise": true,
    "camelcase": true,
    "curly": false,
    "eqeqeq": true,
    "forin": true,
    "eqnull": true,
    "indent": 4,
    "newcap": true,
    "noarg": true,
    "undef": true,
    "strict": false,
    "trailing": true,
    "smarttabs": false,
    "loopfunc": true,
    "globals": {
        "describe": false,
        "it": false,
        "before": false,
        "beforeEach": false,
        "after": false,
        "afterEach": false
    }
}
```

##Standards for Tests

There are two types of tests in the project: integration tests and unit tests.

Integration tests partially mock the tested functionality, or use test instanced for 3rd party cloud services that are attended to test a vertical unit.
Integration tests are located in folder <code>test/api</code>
Unit Tests isolates the unit of testing and provides analyses functionality according to mocked output/input data.
Unit Tests are located in folder <code>test/unit</code>

Project uses <code>mocha</code> test framework to run and write tests. Mocks are written with  <code>sinon</code> and assertions with <code>should</code>
Codecoverage is covered with  <code>istanbul</code> code coverage framework.

Test files need to be named on following pattern: <code><testing js module>.spec.js</code>

Please consider to write meaningfull test descprion as well as group tests together in units according to the pattern:
 1. Testing Module (e.c. 'Testing of BookingModel') 
 2. Testing Functionality (example 'Testing booking creation')
 3. Description of test target (example 'Test if exception thrown if booking has no start time set')
 
 Here is a example of a simple test in Booking Model
 
 ```
 describe('Booking model test', function () {
     describe('Test accessing bookings', function () {
            it('Test if we can get all bookings of a project according to spec', function (done) {
                sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                    callback(null, testBookingRs);
                });
                bookingModel.listAllBookings(0, 20, function (err, bookings) {
                    should(bookings.data.length).be.equal(1);
                    done();
                });
    
            });
      };
  };
  ```