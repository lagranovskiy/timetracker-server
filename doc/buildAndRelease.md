# Development workflow about Timetracker implementation

## Information about release units (Welche Release Units gibt es?)

There are two release units: timetracker-client and timetracker server.

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

