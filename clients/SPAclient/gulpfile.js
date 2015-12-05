"use strict";

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

// set these with environmental variables, e.g. env MINIFY=1 gulp build-js
var envOpts = {
	minify: process.env.MINIFY || false
};

// holds path descriptors for our input files
var paths = {
	scripts: ["js/**/*.js"],
	tests: ["js/**/__tests__/*.js"],
	sass: ["scss/app.scss"],
	sassAllFiles: ["scss/**/*.scss"],
	mdifonts: ["node_modules/mdi/fonts/**"]
};

var externalLibs = [
	'jquery',
	'lodash',
	'react',
	'react/addons',
	'react-masonry-mixin',
	'crossroads',
	'hasher',
	'react-tap-event-plugin',
	'react-dropzone',
	'react-tagsinput',
	'react-timer-mixin',
	'velocity-animate',
	'velocity-animate/velocity.ui',
	'object-assign',
	'handlebars',
	'browserify',
	'flux',
	'events'
];

// run browserify, with or without setting up incremental rebuilds with watchify
function doBrowserify (withWatchify) {
	var browserifyOpts = {
		transform: ["reactify", "envify"],
		entries: ["./js/app.js"]
	};
	// "watchify(browserified)" has the same API as "browserified", but watches for changes
	// and calls event handler registered with .on("update")
	var browserified = browserify(browserifyOpts);
	browserified = withWatchify ? watchify(browserified) : browserified;

	externalLibs.forEach(function(lib) {
		browserified.external(lib);
	});

	var f = function (changedFiles) {
		if (withWatchify) {
			isWatching = true;
		}

		var compileStream;
		if (envOpts.minify) {
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
				.pipe(source('app.min.js'))
				.pipe(buffer())
				.pipe(streamify(uglify()))
				.pipe(gulp.dest('./js-bundle'));
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
				.pipe(gulp.dest('./js-bundle'));
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

gulp.task('build-js', ['clean-js', 'lint', 'build-vendor-js', 'build-iframe-js'], doBrowserify(false));
gulp.task('watch-js', ['clean-js', 'lint', 'build-vendor-js', 'watch-iframe-js'], doBrowserify(true));


gulp.task('lint', function () {
	return gulp.src(paths.scripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('build-css', ['clean-css', 'build-mdi-fonts', 'build-iframe-css'], function () {
	return gulp.src(paths.sass)
		.pipe(concat('app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css-bundle/'));
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
	return gulp.src("./css-bundle/**/*.css").pipe(through.obj(function (file, enc, cb) {
		del(file.path, function (err, deletedFiles) {
			if (!err) {
				gutil.log("Deleted", deletedFiles);
				cb();
			}
		});
	}));
});

gulp.task('clean-js', function () {
	return gulp.src("./js-bundle/**/*.js").pipe(through.obj(function (file, enc, cb) {
		del(file.path, function (err, deletedFiles) {
			if (!err) {
				gutil.log("Deleted", deletedFiles);
				cb();
			}
		});
	}));
});

gulp.task('clean-mdi-fonts', function () {
	return gulp.src("../font/materialdesignicons-webfont*").pipe(through.obj(function (file, enc, cb) {
		del(file.path, {force: true}, function (err, deletedFiles) {
			if (!err) {
				gutil.log("Deleted", deletedFiles);
				cb();
			}
		});
	}));
});

gulp.task('build-mdi-fonts', ['clean-mdi-fonts'], function () {
	return gulp.src(paths.mdifonts)
		.pipe(gulp.dest('../font/'));
});

gulp.task('default', ['watch-build']);

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
			.pipe(gulp.dest('./js-bundle'));
	} else {
		browserified.bundle()
			.on('error', gutil.log.bind(gutil, "Browserify Error"))
			.pipe(source('vendor.js'))
			.pipe(buffer())
			.pipe(gulp.dest('./js-bundle'));
	}
});

function iframeBundle(withWatchify) {
	var browserifyOpts = {
		entries: ["./js/rendering/iframe"]
	};
	var browserified = withWatchify ? watchify(browserify(browserifyOpts)) : browserify(browserifyOpts);

	var build = function() {
		if (envOpts.minify) {
			browserified.bundle()
				.on('error', gutil.log.bind(gutil, "Browserify Error"))
				.pipe(source('iframe.min.js'))
				.pipe(buffer())
				.pipe(streamify(uglify()))
				.pipe(gulp.dest('./js-bundle'));
		} else {
			browserified.bundle()
				.on('error', gutil.log.bind(gutil, "Browserify Error"))
				.pipe(source('iframe.js'))
				.pipe(buffer())
				.pipe(gulp.dest('./js-bundle'));
		}
	};

	if (withWatchify) {
		browserified.on('update', build);
		browserified.on('log', gutil.log);
	}

	return build;
}

gulp.task('build-iframe-js', ['clean-js', 'lint', 'build-vendor-js'], iframeBundle());
gulp.task('watch-iframe-js', ['clean-js', 'lint', 'build-vendor-js'], iframeBundle(true));

gulp.task('build-iframe-css', ['clean-css'], function () {
	return gulp.src('scss/iframe.scss')
		.pipe(concat('iframe.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css-bundle/'));
});

gulp.on('stop', function () {
	if (!isWatching) {
		process.nextTick(function() {
			process.exit(0);
		});
	}
});
