/*jslint node: true */
var config = {
    dev: {
        host: 'localhost',
        httpPort: 8484,
        sslPort: 4433,
        sessionSecret: 'mykey',
        env: 'dev',
        db: {
            url: 'http://localhost:7474'
        },
        jmsUrl: {
            url: "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-local'
        },
        redis: {
            url: "redis://rediscloud:YgmAYK7qkMToFCEO@pub-redis-19055.eu-west-1-1.2.ec2.garantiadata.com:19055"
        },
        options: {
            key: 'certs/timetracker.key.pem',
            cert: 'certs/timetracker.crt'
        },
        init: function () {
            process.env.DEBUG = '*';
            return this;
        }
    },
    test: {
        host: 'localhost',
        httpPort: 8484,
        sslPort: 4433,
        sessionSecret: 'mykey',
        env: 'dev',
        db: {
            url: 'http://timetrackertest:JjOf0u6Ac15qLNg01TWq@timetrackertest.sb04.stations.graphenedb.com:24789'
        },
        jmsUrl: {
            url: "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-test'
        },
        redis: {
            url: "redis://rediscloud:YgmAYK7qkMToFCEO@pub-redis-19055.eu-west-1-1.2.ec2.garantiadata.com:19055"
        },
        options: {
            key: 'certs/timetracker.key.pem',
            cert: 'certs/timetracker.crt'
        },
        init: function () {
            process.env.DEBUG = '*';
            return this;
        }
    },
    prod: {
        host: 'localhost',
        httpPort: false,
        sslPort: 443,
        sessionSecret: 'IdfesnpIPLZ/UEW2224fcJKINJUKNJ',
        env: 'prod',
        db: {
            url: 'http://localhost:7474'
        },
        jmsUrl: {
            url: "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-prod'
        },
        redis: {
            url: "redis://rediscloud:YgmAYK7qkMToFCEO@pub-redis-19055.eu-west-1-1.2.ec2.garantiadata.com:19055"
        },
        options: {
            key: 'certs/timetracker.key.pem',
            cert: 'certs/timetracker.crt'
        },
        init: function () {
            return this;
        }
    },
    heroku: {
        host: '0.0.0.0',
        httpPort: process.env.PORT || 8000,
        sslPort: false,
        sessionSecret: 'snp819819681INJUKNJ',
        env: 'prod',
        db: {
            url: process.env.GRAPHENEDB_URL
        },
        jmsUrl: {
            url: process.env.CLOUDAMQP_URL,
            exchangeName: 'timetracker-heroku'
        },
        redis: {
            url: process.env.REDISCLOUD_URL
        },
        init: function () {
            return this;
        }
    }
};

// Read environment variable NODE_ENV or set it to development per default if not set
var env = process.env.NODE_ENV || 'dev';

// Export initialized envirenment config according to the set environment
module.exports = config[env].init();