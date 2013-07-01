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
        src: ['js/entities.js', 'js/actorPrototype.js', 'js/baddyPrototype.js', 'js/**/*.js', '!js/edit.js'],
        dest: 'production/app-min.js'
      }
    },
    bumpup: {
      file: 'package.json'
    },
    open: {
      all: {
        path: 'http://localhost:8080/'
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

/*module.exports = function(grunt) {
 
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt 
  grunt.initConfig({
 
    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {
        options:{
          port: 9000,
          hostname: "0.0.0.0",
          // No need for keepalive anymore as watch will keep Grunt running
          //keepalive: true,
 
          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
 
            return [
 
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
 
              // Serve the project folder
              connect.static(options.base)
            ];
          }
        }
      }
    },
 
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.all.options.port%>'
      }
    },
 
    // grunt-regarde monitors the files and triggers livereload
    // Surprisingly, livereload complains when you try to use grunt-contrib-watch instead of grunt-regarde 
    regarde: {
      all: {
        // This'll just watch the index.html file, you could add **\/*.js or **\/*.css
        // to watch Javascript and CSS files too.
        files:['index.html'],
        // This configures the task that will run when the file change
        tasks: ['livereload']
      }
    }
  });
 
  // Creates the `server` task
  grunt.registerTask('server',[
    
    // Starts the livereload server to which the browser will connect to
    // get notified of when it needs to reload
    'livereload-start',
    'connect',
    // Connect is no longer blocking other tasks, so it makes more sense to open the browser after the server starts
    'open',
    // Starts monitoring the folders and keep Grunt alive
    'regarde'
  ]);
};*/