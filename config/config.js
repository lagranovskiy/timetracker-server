var config = {
    dev: {
        port: 8484,
        env: 'dev',
        db: {
            url : 'http://localhost:7474'
        },
        init: function () {
            process.env.DEBUG = '*';
            return this;
        }
    },
    prod: {
        port: 8484,
        env: 'prod',
        db: {
            url : 'http://localhost:7474'
        },
        init: function () {
            return this;
        }
    }
};

// Read environment variable NODE_ENV or set it to development per default if not set
var env = process.env.NODE_ENV || 'dev';

// Export initialized envirenment config according to the set environment
module.exports = config['dev'].init();