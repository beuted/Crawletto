module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            public : {
                options: {
                    module: 'amd'
                },
                src: ['public/**/*.ts', '!**/*.d.ts']
            },
            server : {
                options: {
                    module: 'commonjs'
                },
                src: ['app.ts', 'server/**/*.ts','!**/*.d.ts']
            }
        },

        nodemon: {
            server: {
                src: ['app.js']
            },
            options: {
                watch: ['server'],
                env: {
                    PORT: '8181'
                },
                delay: 2000,
            }
        },

        watch: {
            tsPublic: {
                files: './public/**/*.ts',
                tasks: ['ts:public'],
                options: {
                    atBegin: true,
                    livereload: true
                }
            },
            tsServer: {
                files: ['./server/**/*.ts', './app.ts'],
                tasks: ['ts:server'],
                options: {
                    atBegin: true
                }
            }
        },

        concurrent: {
            allWatchs: {
                tasks: ['nodemon:server', 'watch:tsServer', 'watch:tsPublic'],
                options: {
                    logConcurrentOutput: true
                }
            },
            serverWatchs: {
                tasks: ['nodemon:server', 'watch:tsServer'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts:public', 'ts:server']);
    grunt.registerTask('dev', ['concurrent:allWatchs']);
    grunt.registerTask('dev-public', ['watch:tsPublic']);
    grunt.registerTask('dev-server', ['concurrent:serverWatchs']);
};
