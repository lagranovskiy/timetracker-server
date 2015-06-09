# General Information about Timetracker implementation

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
