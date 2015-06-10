# Get it running ... quickly?

Timetracker is a scalable solution to track time bookings and projects. This flexibility is provided by transfering the session state as well as a node intercommunication on the separate communication systems.
Following infrastructure dependencies are required and need to be availiable in the execution environment:

    * Neo4j as a datastorage (http:// neo4j.com)
    * Redis as a session state storage (http://resis.com)
    * RabbitMQ as a messaging broker

You can drive multiple strategies to get it availiable on your target system. As described below you can use your environment variables to configure the application startup.
This kind of configuration is a most recommended way according to [Twelfe factor metholodology](12factor.net) manifest of software development collected and released by heroku PAAS. 
In this documentation you can find information about multiple ways to get running with the application.


## Configure application properties

Environment Variable  | Default value if nothing set | Description
------------- | ------------- | -------------
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
NEW_RELIC_LICENSE_KEY | null | key to use for new relic application monitoring

## Docker way
Docker is a modern contaner engine, it allows you to pull and run multiple prepared docker images in locally stored containers or build and run your own buildfile.
Detailed information about docker you can find at [Docker](http://docker.io). It can be used to provide needed infrastructure.

After you have installed docker on your system environment run following commands
    
    # Creates a redis instance on port 6379 with name tt-redis
    docker run --name tt-redis -d -p 6379:6379 redis redis-server --appendonly yes
    # Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/_/redis/)
    
    # Creates a neo4j instance on port 7474 with name tt-neo4j
    docker run -d --name tt-neo4j -p 7474:7474 frodenas/neo4j
    Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/u/frodenas/neo4j/)
        
    # Creates a amqp rabbitmq instance on port 5672 with name tt-rabbit
    docker run -d -e RABBITMQ_NODENAME=my-rabbit --name tt-rabbit rabbitmq:3
    # docker logs some-rabbit (to get the automatically created credentials)
    # Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/_/rabbitmq/)

After you pulled and started the containers (automatically) you can controll them by using <code>docker stop / start <container name></code>
As far you do not need the instance anymore, you can remove it by running <code>docker rm <container name></code>. For more extended usage please refer to the docker documentation.
As far you got things running, simply control if you need to change some credentials or urls from default to custom value and do it in env vars as described earlier.

## Bad way
The old, bad, awful and dirty way to get things installed is to download them separately from vendor sites and install them locally.

## Cloud Service way
As far as you cannot use docker and a "bad way" because you dont have admin rights on the server etc. you still can use cloud services to
do it. There are a lot of vendors who offer reddis, neo4j and rabbit as a cloud. The simpliest tarif is normally free and can be used to get started.
To go this way, get your own instances on following services:
(https://cloudamqp.com)
(https://graphinedb.com)
(https://rediscloud.....)

## Node installation

### NVM

Node installation is made easily using NVM(https://github.com/creationix/nvm) tool. It controlles node installations on the system and let you switch node version easily.
Please refer to the installation instructions according to your operational system on [nvm documentation](https://github.com/creationix/nvm)

### Grunt CLI

As far you have node over nvm running, you need to install grunt build worker for node as a plugin.

<code>npm install grunt-cli -g </code>

### Bower dependency management (for the client)

<code>npm install bower -g </code>

### Mocha tests

<code>npm install mocha -g </code>

## Installing, starting and testing of the application

<code>npm install</code> installs all needed dependencies

<code>grunt test</code> run tests for the application

<code>grunt server</code> start server part locally according to the configuration

## Reset Initial state

As you have started the server, it listens on given or default port and you can access the REST interface with SoapUI or other Client.
The initial state for the application (roles, default users etc) can be deployed manually by execution of <code>dml.cypher</code> in the root of the repository directly in neo4j webconsole.

There is also other "development" method to reset the state: trigger the REST reset service:
<code>GET https://localhost:<port>/init</code>
It will remove all data and store initial state. This service is only enabled if NODE_ENV variable is not set or is 'dev'.
After the service executed you can use following users to access the application:

Username | Name | Role | Password
-------------|-------------|-------------|-------------
mmustermann | Max Mustermann | User | prodyna
mdoener | Michael Döner | Manager | prodyna
aschmidt | Alice Schmidt | Admin | prodyna
mdobro | Mischa Dombrowsky | User | prodyna
dbero | David Bero | User | prodyna
dkeller | Daniel Keller| User | prodyna
dschmidt | Dorechy Schmidt | User | prodyna
rmachno | Tolend Mancho| User | prodyna
tagranovskiy | Tim Agranovskiy| User | prodyna
lagranovskiy | Leo Agranovskiy| User | prodyna
pagranovskiy | Paul Agranovskiy| User | prodyna
