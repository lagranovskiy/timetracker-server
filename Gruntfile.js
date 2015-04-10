// https://github.com/gregjopa/express-app-testing-demo
module.exports = function(grunt) {

    // configuration
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['test/coverage/**/*.js']
            },
            files: {
                src: ['app/**/*.js', 'test/**/*.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },


        watch: {
            lint: {
                files: '<%= jshint.files.src %>',
                tasks: 'jshint'
            },
            test: {
                files: ['test/unit/*.js', 'test/api/*.js', 'test/integration/*.js'],
                tasks: ['jshint', 'mochaTest:unit', 'mochaTest:api', 'mochaTest:integration']
            }
        },


        nodemon: {
            dev: {
                script: 'app/app.js',
                options: {
                    ext: 'js,json'
                }
            }
        },


        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },


        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/unit/*.js']
            },
            integration: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/integration/*.js']
            },
            api: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/api/*.js']
            }
        },




        // start - code coverage settings

        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/app/'
            }
        },


        clean: {
            coverage: {
                src: ['test/coverage/']
            }
        },


        copy: {
            views: {
                expand: true,
                flatten: true,
                src: ['app/*'],
                dest: 'test/coverage/instrument/app/'
            }
        },


        instrument: {
            files: 'app/**/*.js',
            options: {
                lazy: false,
                basePath: 'test/coverage/instrument/'
            }
        },


        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },


        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        },

        // end - code coverage settings


        // code climate
        codeclimate: {
            options: {
                file: 'test/coverage/reports/lcov.info',
                token: 'e6f6d6ce00e4a95c1726045ab8b305ed08195686b9832c06bcd09c130e20a712'
            }
        }
        // ...

        // end code climaet
    });


    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-codeclimate');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');

    grunt.loadNpmTasks('grunt-debug-task');


    // tasks
    grunt.registerTask('server', ['concurrent:target']);
    grunt.registerTask('default', ['jshint', 'server']);
    grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:integration', 'mochaTest:api']);

    grunt.registerTask('coverage', ['jshint', 'clean', 'env:coverage', 'instrument', 'test', 'storeCoverage', 'makeReport', 'codeclimate']);

};