// Include gulp
var gulp = require('gulp');

// Include plugins
var log = require('fancy-log');
var colors = require('ansi-colors');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');



// Paths
var src = 'src/';
var dest = 'static/';

 // Concatenate & Minify JS
gulp.task('scripts', function() {
		return gulp.src(src + 'js/*.js')
				.pipe(plumber(function(error) {
						log(colors.red(error.message));
						this.emit('end');
				}))
				.pipe(concat('main.js'))
				.pipe(uglify())
				.pipe(gulp.dest(dest + 'js'));
});

gulp.task('scriptsDev', function() {
		return gulp.src(src + 'js/*.js')
				.pipe(plumber(function(error) {
						log(colors.red(error.message));
						this.emit('end');
				}))
				.pipe(sourcemaps.init())
				.pipe(concat('main.js'))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(dest + 'js'))
				.pipe(livereload({ start: true }));
});

gulp.task('sass', function() {
		return gulp.src(src + 'scss/base.scss')
				.pipe(plumber(function(error) {
						log(colors.red(error.message));
						this.emit('end');
				}))
				.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
				.pipe(prefix({browsers: ['last 4 version']}))
				.pipe(rename('main.css'))
				.pipe(gulp.dest(dest + 'css'));
});

gulp.task('sassDev', function() {
		return gulp.src(src + 'scss/base.scss')
				.pipe(plumber(function(error) {
						log(colors.red(error.message));
						this.emit('end');
				}))
				.pipe(sourcemaps.init())
				.pipe(sass().on('error', sass.logError))
				.pipe(sourcemaps.write())
				.pipe(rename('main.css'))
				.pipe(gulp.dest(dest + 'css'))
				.pipe(livereload({ start: true }));
});

gulp.task('copy-scss', function() {
		return gulp.src(src + 'scss/*.scss')
				.pipe(gulp.dest(dest + 'css'));
});

gulp.task('images', function() {
	return gulp.src(src + 'images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
		.pipe(gulp.dest(dest + 'img'));
});

gulp.task('fonts', function() {
	return gulp.src(src + 'fonts/*')
		.pipe(gulp.dest(dest + 'fonts'));
});

gulp.task('watch', function() {
	livereload.listen();
	 // Watch .js files
	gulp.watch(src + 'js/*.js', gulp.task('scriptsDev'));
	 // Watch .scss files
	gulp.watch(src + 'scss/*.scss', gulp.task('sassDev'));
	// Watch image files
	gulp.watch(src + 'images/**/*', gulp.task('images'));
	// Watch font files
	gulp.watch(src + 'fonts/*', gulp.task('fonts'));
});


// Default task
gulp.task('default', gulp.series('scriptsDev', 'sassDev', 'copy-scss', 'images', 'fonts', 'watch'));
// Build task
gulp.task('build', gulp.parallel('scripts', 'sass', 'images', 'fonts'));

gulp.task('clear', function() {
	// Still pass the files to clear cache for
	gulp.src('images/**')
		.pipe(cache.clear());
});
