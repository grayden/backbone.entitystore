module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    jasmine: {
      options: {
        specs: 'specs/*.spec.js',
        vendor: [
          'vendor/jquery.min.js',
          'node_modules/sinon/pkg/sinon.js',
          'node_modules/underscore/underscore.js',
          'node_modules/backbone/backbone.js'
        ]
      },
      entitystore: {
        src: 'src/*.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
