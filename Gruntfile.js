module.exports = function(grunt) {
  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-open');

  // config
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', '!js/lib/*.js']
    },
    uglify: {
      options: {
        wrap: true,
        report: 'min',
        sourceMap: 'production/sourceMap.js',
        sourceMapRoot: '../',
        sourceMappingURL: 'sourceMap.js'
      },
      min: {
        src: ['js/objectPrototype.js', 'js/escape.js', 'js/map.js', 'js/entities.js', 'js/actorPrototype.js', 'js/baddyPrototype.js', 'js/**/*.js', '!js/edit.js'],
        dest: 'production/app-min.js'
      }
    },
    bumpup: {
      file: 'package.json'
    },
    open: {
      production: {
        path: 'http://localhost:8080/'
      },
      dev: {
        path: 'http://localhost:8080/dev.html'
      }
    }
  });
  grunt.registerTask('default', ['build', 'bumpup:build']);
  grunt.registerTask('build', function() {
    grunt.task.run('jshint');
    grunt.task.run('uglify');
  });
  grunt.registerTask('patch', ['build', 'bumpup:patch']);
  grunt.registerTask('minor', ['build', 'bumpup:minor']);
  grunt.registerTask('major', ['build', 'bumpup:major']);
};