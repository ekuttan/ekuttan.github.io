module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        website: {
          files: {
            'src/js/website/all.min.js': [
                    'node_modules/angular.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    'website/js/share.js',
                ]
          }
        }
      },
      jshint: {
        files: ['Gruntfile.js', 'website/js/*.js',],
        options: {
          // options here to override JSHint defaults
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify'); // load the given tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint','uglify']); // Default grunt tasks maps to grunt
};