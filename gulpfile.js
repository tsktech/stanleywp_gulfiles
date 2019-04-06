// Load all the modules from package.json
// var gulp = require('gulp'),
//	

const { task, src, dest, series, parallel, watch } = require('gulp');
const zip 			= require('gulp-zip');
const jshint 		= require( 'gulp-jshint' );
const stylish 		= require('jshint-stylish');
const uglify 		= require( 'gulp-uglify' );
const rename 		= require( 'gulp-rename' );
const notify 		= require( 'gulp-notify' );
const include 		= require( 'gulp-include' );
const plumber 		= require( 'gulp-plumber' );
const autoprefixer 	= require( 'gulp-autoprefixer' );
const sass 			= require( 'gulp-sass');
const critical 		= require('critical');
const imageoptim 	= require('gulp-imageoptim');
// const mageAlpha     = require('gulp-imagealpha');


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

var config = {
     nodeDir: './node_modules' 
}

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
		'!.g*',
		'!gulp*',
		'!package*',
		'!stanleywp.zip',
		], {base: "."})
	.pipe(zip('stanleywp.zip'))
	.pipe(dest('./outputZip'));
}

function jshintIssues(){
	return src( './js/src/*.js' )
	.pipe( jshint() )
	.pipe( jshint.reporter( stylish ) )
	.pipe( jshint.reporter( 'fail' ) );
}

function scripts() {
  return src( './js/manifest.js' )
    .pipe( include() )
    .pipe( rename( { basename: 'scripts' } ) )
    .pipe( dest( './js/dist' ) )
    // Normal done, time to create the minified javascript (scripts.min.js)
    // remove the following 3 lines if you don't want it
    .pipe( uglify() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( dest( './js/dist' ) )
    .pipe(browserSync.reload({stream: true}))
    .pipe( notify({ message: 'scripts task complete' }));
}


// Different options for the Sass tasks
var options = {};
options.sass = {
  errLogToConsole: true,
  precision: 8,
  noCache: true,
  //imagePath: 'assets/img',
  includePaths: [
    config.nodeDir + '/bootstrap/scss',
  ]
};

options.sassmin = {
  errLogToConsole: true,
  precision: 8,
  noCache: true,
  outputStyle: 'compressed',
  //imagePath: 'assets/img',
  includePaths: [
    config.nodeDir + '/bootstrap/scss',
  ]
};


// Sass
function scss() {
    return src('./sass/style.scss')
        .pipe(plumber())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest('.'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ title: 'Sass', message: 'sass task complete'  }));
}


// Sass-min - Release build minifies CSS after compiling Sass
function scss_min() {
    return src('./sass/style.scss')
        .pipe(plumber())
        .pipe(sass(options.sassmin).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename( { suffix: '.min' } ) )
        .pipe(dest('.'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ title: 'Sass', message: 'sass-min task complete' }));
}


// Optimize Images
function images() {
    return src('./images/**/*')
        .pipe(imageoptim.optimize())
        .pipe(dest('./imagesopt/'))
        .pipe( notify({ message: 'Images task complete' }));
}
//      .pipe(imageoptim.optimize({jpegmini: true}))
// jpegmini is paid version
// 
// var imagemin = require( 'gulp-imagemin' );


/**
 * Task: `imgopt`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp imgopt`.
 */
 
// gulp.task( 'imgopt', function() {
// 	gulp.src( imagesSRC )
// 		.pipe( imagemin({
// 			progressive: true,
// 			optimizationLevel: 3, // 0-7 low-high
// 			interlaced: true,
// 			svgoPlugins: [{removeViewBox: false}]
// 		}))
// 		.pipe( gulp.dest( imagesDestination ) )
// 		.pipe( notify( { message: 'DONE: Images Optimized! 💯', onLast: true } ) );
// } );



// Generate & Inline Critical-path CSS
function criticalTask (done) {
    critical.generate({
        base: './',
        src: 'http://localhost:8888/wordpress/',
        dest: 'css/home.min.css',
        ignore: ['@font-face'],
        dimensions: [{
          width: 320,
          height: 480
        },{
          width: 768,
          height: 1024
        },{
          width: 1280,
          height: 960
        }],
        minify: true
    });
    done();
}

task('critical', criticalTask );
task ('images', images);

// Sass-min - Release build minifies CSS after compiling Sass
task('sass-min', scss_min);

// sass
task('sass', scss);


// Concatenates all files that it finds in the manifest
// and creates two versions: normal and minified.
// It's dependent on the jshint task to succeed.
task( 'scripts', scripts );

// Jshint outputs any kind of javascript problems you might have
// Only checks javascript files inside /src directory
task( 'jshint', jshintIssues);

// Zip files up for Distribution
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





