"use strict";

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var through = require('through2');
var jest = require('jest-cli');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var del = require('del');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var streamify = require('gulp-streamify');
require('harmonize')();

// This is stupid. So stupid. This closed issue is causing gulp to hang
// after all jobs are done. https://github.com/gulpjs/gulp/issues/167
// A very stupid solution: define a global variable isWatching. Set it
// to true in any builds that need to continue running indefinitely.
// When it isn't true, exit the process after we're done. Manually.

// Boo.
var isWatching = false;

var StyleSheetsOutput = process.env.STYLESHEETS_OUTPUT;
var JavaScriptOutput = process.env.JAVASCRIPT_OUTPUT;

// holds path descriptors for our input files
var paths = {
	scripts: ["src/**/*.js"],
	tests: ["src/**/__tests__/*.js"],
	sass: ["src/scss/app.scss"],
	sassAllFiles: ["src/scss/**/*.scss"]
};

var externalLibs = [
	'lodash',
	'react',
	'crossroads',
	'flux',
	'events'
];

// run browserify, with or without setting up incremental rebuilds with watchify
function doBrowserify (configuration) {
	var isDevelopment = (configuration === 'dev');

	var browserifyOpts = {
		transform: ["reactify", "envify"],
		entries: ["bin/app.js"]
	};
	// "watchify(browserified)" has the same API as "browserified", but watches for changes
	// and calls event handler registered with .on("update")
	var browserified = browserify(browserifyOpts);
	browserified = isDevelopment ? watchify(browserified) : browserified;

	externalLibs.forEach(function(lib) {
		browserified.external(lib);
	});

	var f = function (changedFiles) {
		if (isDevelopment) {
			isWatching = true;
		}

		var compileStream;
		if (envOpts.minify) {
			compileStream = browserified.bundle()
				.on('error', function (error) {
					gutil.log(error);
					if (!isDevelopment) {
						process.exit(1);
					}
				})
				.on('package', function (pkg) {
					gutil.log("## Package " + pkg.name + "(" + pkg.main + ") was included into application bundle");
				})
				.pipe(source('app.min.js'))
				.pipe(buffer())
				.pipe(streamify(uglify()))
				.pipe(gulp.dest(JavaScriptOutput));
		} else {
			compileStream = browserified.bundle()
				.on('error', function (error) {
					gutil.log(error);
					if (!withWatchify) {
						process.exit(1);
					}
				})
				.on('package', function (pkg) {
					gutil.log("## Package " + pkg.name + "(" + pkg.main + ") was included into application bundle");
				})
				.pipe(source('app.js'))
				.pipe(buffer())
				.pipe(gulp.dest(JavaScriptOutput));
		}

		if (changedFiles && Array.isArray(changedFiles)) {
			var lintStream = gulp.src(changedFiles)
					.pipe(eslint())
					.pipe(eslint.format());

			return merge(lintStream, compileStream);
		}

		return compileStream;
	};

	if (withWatchify) {
		browserified.on('update', f);
		browserified.on('log', gutil.log);
	}

	return f;
}

gulp.task('build-prod', ['clean-js', 'lint', 'build-vendor-js'], doBrowserify('prod'));
gulp.task('build-dev', ['clean-js', 'lint', 'build-vendor-js'], doBrowserify('dev'));

gulp.task('lint', function () {
	return gulp.src(paths.scripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('build-css', ['clean-css'], function () {
	return gulp.src(paths.sass)
		.pipe(concat('app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(StyleSheetsOutput));
});

gulp.task('test', function () {
	return gulp.src(paths.tests)
		.pipe(through.obj(function (file, enc, cb) {
			jest.runCLI({
				'_': [file.path]
			}, __dirname, function (success) {
				if (success) {
					cb();
				} else {
					cb(new gutil.PluginError('gulp-jest', {message: "Tests Failed"}));
				}
			});
		}));
});

gulp.task('watch-build', ['build-css', 'watch-js'], function () {
	isWatching = true;
	gulp.watch(paths.sassAllFiles, ['build-css']);
});

gulp.task('watch-test', function () {
	isWatching = true;
	gulp.watch(paths.scripts, ['test']);
});

gulp.task('clean-css', function () {
	return gulp.src(path.join(StyleSheetsOutput, "**/*.css")).pipe(through.obj(function (file, enc, cb) {
		del(file.path, function (err, deletedFiles) {
			if (!err) {
				gutil.log("Deleted", deletedFiles);
				cb();
			}
		});
	}));
});

gulp.task('clean-js', function () {
	return gulp.src(path.join(StyleSheetsOutput, "**/*.js")).pipe(through.obj(function (file, enc, cb) {
		del(file.path, function (err, deletedFiles) {
			if (!err) {
				gutil.log("Deleted", deletedFiles);
				cb();
			}
		});
	}));
});

gulp.task('build-vendor-js', function() {
	var browserified = browserify();

	externalLibs.forEach(function(lib) {
		browserified.require(lib);
	});

	if (envOpts.minify) {
		browserified.bundle()
			.on('error', gutil.log.bind(gutil, "Browserify Error"))
			.pipe(source('vendor.min.js'))
			.pipe(buffer())
			.pipe(streamify(uglify()))
			.pipe(gulp.dest(JavaScriptOutput));
	} else {
		browserified.bundle()
			.on('error', gutil.log.bind(gutil, "Browserify Error"))
			.pipe(source('vendor.js'))
			.pipe(buffer())
			.pipe(gulp.dest(JavaScriptOutput));
	}
});

gulp.on('stop', function () {
	if (!isWatching) {
		process.nextTick(function() {
			process.exit(0);
		});
	}
});

gulp.task('default', ['build-dev']);
