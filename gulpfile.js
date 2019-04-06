// Load all the modules from package.json
var gulp = require('gulp'),
	browserSync = require('browser-sync').create();


// automatically reloads the page when files changed
var browserSyncWatchFiles = [
    './*.min.css',
    './js/**/*.min.js',
    './**/*.php'
];

// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
    watchTask: true,
    proxy: "http://localhost:8888/wordpress/",
    browser: ["google chrome", "firefox"]
}

// Default error handler
var onError = function( err ) {
  console.log( 'An error occured:', err.message );
  this.emit('end');
}


// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

// Start the livereload server and watch files for change
gulp.task( 'watch', function() {
 
  // don't listen to whole js folder, it'll create an infinite loop
  gulp.watch( [ './js/**/*.js', '!./js/dist/*.js' ], [ 'scripts' ] )
 
  gulp.watch( './sass/**/*.scss', ['sass', 'sass-min'] );

  gulp.watch( './images/**/*', ['images']);
 
  //gulp.watch( './**/*.php' ).on('change', browserSync.reload);
   
} );


