// Load all the modules from package.json
// var gulp = require('gulp'),
//	

const { task, src, dest, series, parallel, watch } = require('gulp');
const zip = require('gulp-zip');


var browserSync = require('browser-sync').create();
 
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
    browser: "google chrome"
}
// browser: ["google chrome", "firefox"]

//https://www.youtube.com/watch?v=2HpNiyimo8E
function watch_files () {
	gulp.watch([ './js/**/*.js', '!./js/dist/*.js' ], )
}

// Default error handler
var onError = function( err ) {
  console.log( 'An error occured:', err.message );
  this.emit('end');
}

function buildzip() {
	return src([
		'*',
		'./css/*',
		'./fonts/*',
		'./images/**/*',
		'./inc/**/*',
		'./js/**/*',
		'./languages/*',
		'./sass/**/*',
		'./template-parts/*',
		'./templates/*',
		'!bower_components',
		'!node_modules',
		], {base: "."})
	.pipe(zip('stanelywp.zip'))
	.pipe(dest('.'));
}

// Zip files up
task('buildzip', buildzip);

// Starts browser-sync task for starting the server.
task('browser-sync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});




//watcher.on('all', function() {
  // console.log('File ' + path + ' was ' + event + ', running tasks...');
//});

task('default', series(parallel('browser-sync'), function() {
     // Does nothing in this task, just triggers the dependent 'watch'
}));





