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
        options: {
            key: 'certs/timetracker.key.pem',
            cert: 'certs/timetracker.crt'
        },
        init: function() {
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
        options: {
            key: 'certs/timetracker.key.pem',
            cert: 'certs/timetracker.crt'
        },
        init: function() {
            return this;
        }
    }
};

// Read environment variable NODE_ENV or set it to development per default if not set
var env = process.env.NODE_ENV || 'dev';

// Export initialized envirenment config according to the set environment
module.exports = config.dev.init();