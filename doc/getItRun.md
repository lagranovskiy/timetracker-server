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

## Docker way
Docker is a modern contaner engine, it allows you to pull and run multiple prepared docker images in locally stored containers or build and run your own buildfile.
Detailed information about docker you can find at [Docker](http://docker.io). It can be used to provide needed infrastructure.


e9c167fc269a        f2fb89b0a711                       /entrypoint.sh redis   5 weeks ago         Exited (0) 46 hours ago   0.0.0.0:6379->6379/tcp                                                                   tt-redis            
ffa530d4dd7c        cc4b997094e0                       /run.sh                7 weeks ago         Exited (0) 8 days ago     0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp                                         some-rabbit         
0ca4233255a1        frodenas/neo4j:latest              /scripts/run.sh        4 months ago        Exited (0) 5 days ago     0.0.0.0:7474->7474/tcp                    

After you have installed docker on your system environment run following commands
    
    # Creates a redis instance on port 6379
    docker run --name tt-redis -d -p 6379:6379 redis redis-server --appendonly yes
    # Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/_/redis/)
    
    # Creates a neo4j instance on port 7474
    docker run -d --name neo4j -p 7474:7474 frodenas/neo4j
    Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/u/frodenas/neo4j/)
        
    # Creates a amqp rabbitmq instance on port 5672
    ddocker run -d -e RABBITMQ_NODENAME=my-rabbit --name some-rabbit rabbitmq:3
    # docker logs some-rabbit (to get the automatically created credentials)
    # Alternatively or by problems read documentation of the image [here](https://registry.hub.docker.com/_/rabbitmq/)

## Bad way

## Cloud Service way