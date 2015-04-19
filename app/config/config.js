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
            url:  "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-local'
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
            url: 'http://localhost:7474'
        },
        jmsUrl: {
            url:  "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-test'
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
            url:  "amqp://admin:i9lmgtjm0Jzj@localhost:5672",
            exchangeName: 'timetracker-prod'
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
        clientHost: process.env.TT_CLIENT_URL || 'TT_CLIENT_URL not set',
        env: 'prod',
        db: {
            url: process.env.GRAPHENEDB_URL
        },
        jmsUrl: {
            url: process.env.CLOUDAMQP_URL,
            exchangeName: 'timetracker-heroku'
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