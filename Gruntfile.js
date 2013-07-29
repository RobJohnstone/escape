module.exports = function(grunt) {
  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // set working directory to client
  grunt.file.setBase('client');

  // config
  grunt.initConfig({
    pkg: grunt.file.readJSON('../package.json'),
    jshint: {
      all: ['../Gruntfile.js', 'js/**/*.js', '!js/lib/*.js']
    },
    uglify: {
      options: {
        mangle: {
          except: ['create', 'extend']
        },
        report: 'min',
        sourceMap: function(dest) {
          var srcMapName = dest.split('/');
          srcMapName.pop();
          srcMapName.push('sourceMap.js');
          return srcMapName.join('/');
        },
        sourceMapRoot: '../',
        sourceMappingURL: '/production/sourceMap.js'
      },
      files: {
        src: ['js/objectPrototype.js', 'js/escape.js', 'js/map.js', 'js/entities.js', 'js/actorPrototype.js', 'js/baddyPrototype.js', 'js/**/*.js', '!js/edit.js', '!js/palette.js'],
        dest: 'production/app-min.js'
      }
    },
    bumpup: {
      file: '../package.json'
    },
    open: {
      production: {
        path: 'http://localhost:8080/'
      },
      dev: {
        path: 'http://localhost:8080/dev.html'
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
            paths: ".",
            linkNatives: "true",
            outdir: "../docs",
            tabtospace: 4
        }
      }
    }
  });
  grunt.registerTask('default', ['build', 'bumpup:build']);
  grunt.registerTask('build', function() {
    grunt.task.run('jshint');
    grunt.task.run('uglify');
    grunt.task.run('yuidoc');
  });
  grunt.registerTask('patch', ['build', 'bumpup:patch']);
  grunt.registerTask('minor', ['build', 'bumpup:minor']);
  grunt.registerTask('major', ['build', 'bumpup:major']);
};