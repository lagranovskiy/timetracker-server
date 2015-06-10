# Development workflow about Timetracker implementation

## Information about release units (Welche Release Units gibt es?)

There are two release units: timetracker-client and timetracker server.

## Configure application properties

Environment Variable  | Default value if nothing set
------------- | -------------
HOST  | 'localhost' | host to bind to
PORT  | 8484 | Port for the http webserver to listen for
SSLPORT | 4433 | Port to be used by ssl connection or false if no ssl needed
SESSION_SECRET | 'mykey' | Secret string to encrypt cookies
NODE_ENV | 'dev' | Environment
GRAPHENEDB_URL| 'http://localhost:7474' | URL to the neo4j instance
CLOUDAMQP_URL| 'amqp://admin:i9lmgtjm0Jzj@localhost:5672' | URL to the amqp instance
EXCHANGE_NAME | 'timetracker-local' | Name of exchange to be used for event population in the cloud
REDISCLOUD_URL | 'redis://localhost:6379/0' | URL to the redis instance
KEY_PATH | 'certs/timetracker.key.pem' | Path to the key certificate key
CERT_PATH| 'certs/timetracker.crt' | Path to the certificate for ssl

## Explanation of building process (Wie funktioniert der Build?)

Build is processed by travis ci. It is informed by every pushed commit and triggers the build automatically.
The build process consist on following build steps:

 * jshint 
 
     Analyse code if every js file matches code style requirements defined before
   
 * clean
 
    Clean working directory
    
 * instrument
 
    Prepare code by copying and enhancing it in the instrument folder to process code coverage analyse
    
 * test
 
     Run application test and collect coverage information
    
 * storeCoverage
 
    Save collected coverage information in a lcov format
     
 * makeReport
 
    Fetch saved lcov data and create human readable code coverage report
    
 * codeclimate
 
    Transfer lcov data to the codeclimate to mess quality of the product

## Explanation about deployment process (Wie funktioniert das Deployment?)

Every commit leads to a new snapshot release. After any code is commited, github informes configured applications about new commit.
Travis CI pulls the actual sources and execute tests. It all tests are green, than quality ensurance process starts.
This process is serviced by code climate service. It analyzes the code on duplicates, known anti-patterns etc. It also collects information from travis ci test result to get a testcoverage value.
Both services (travisci and codeclimate) have a possibility to fail build/alert someone if something is wrong. It is actually not configured.
If all is ok, the heroku platform is informed about successful build. It pulls sources from github and creates a docker container to run the application version.
As far as container is ready it is stored in the version history of heroku and can be simply recovered. It is a documented release artifact.

## Release process description (Wie erfolgt ein Release?)

Release is made as a normal build with only difference that a trigger for the build is a remote git tag.
Tag has a name in following format: Release_<Version>

```
git add .
git commit -am "Release <Version>"
git push
git tag Release_<Version>
git push origin Release_<Version>
```

## Explanation of artifacts (Welche Artefakte existieren, welches Format haben sie und wo sind sie zu finden?)

