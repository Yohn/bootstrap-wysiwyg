module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            datepicker: {
                src: [
                    'build/wysiwyg.js'
                ],
                dest: 'src/js/wysiwyg.js'
            },
        },
        uglify: {
            datepicker: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'src/js/wysiwyg.js.map'
                },
                files: {
                    'src/js/wysiwyg.min.js': ['build/wysiwyg.js']
                }
            },
        },
        less: {
            style: {
                files: {
                    'src/css/wysiwyg.css': ['build/wysiwyg.less']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 11']
            },
            dist: {
                files: {
                    'src/css/wysiwyg.css': ['src/css/wysiwyg.css']
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            dist: {
                files: {
                    'src/css/wysiwyg.min.css': ['src/css/wysiwyg.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['build/wysiwyg.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                },
            },
            styles: {
                files: ['build/wysiwyg.less'],
                tasks: ['less', 'autoprefixer', 'cssmin'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load npm packages
    // npm install grunt-contrib-concat grunt-contrib-uglify-es grunt-contrib-less grunt-autoprefixer grunt-css grunt-contrib-cssmin grunt-contrib-watch
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Grunt task`s
    grunt.registerTask('default', ['concat', 'uglify', 'less', 'autoprefixer', 'cssmin', 'watch']);
};