'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
  coffee: ['./lib/**/*.coffee'],
  watch: ['./gulpfile.js', './lib/**', './spec/**', '!spec/{temp,temp/**}'],
  tests: ['./spec/**/*.coffee', '!spec/{temp,temp/**}']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('lint', function () {
  return gulp.src(paths.coffee)
    .pipe(plugins.coffeelint())
    .pipe(plugins.coffeelint.reporter());
});<% if (istanbulModule) { %>

gulp.task('istanbul', function (cb) {
  gulp.src(paths.coffee)
    .pipe(plugins.coffeeIstanbul()) // Covering files
    .pipe(plugins.coffeeIstanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(plugins.plumber(plumberConf))<% if (testFramework === 'jasmine') { %>
        .pipe(plugins.jasmine())<% } %><% if (testFramework === 'mocha') { %>
        .pipe(plugins.mocha())<% } %>
        .pipe(plugins.coffeeIstanbul.writeReports()) // Creating the reports after tests runned
        .on('finish', function() {
          process.chdir(__dirname);
          cb();
        });
    });
});<% } else { %>

gulp.task('unitTest', function () {
  require('coffee-script/register')
  gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.plumber(plumberConf))<% if (testFramework === 'jasmine') { %>
    .pipe(plugins.jasmine());<% } %><% if (testFramework === 'mocha') { %>
    .pipe(plugins.mocha({ reporter: 'list' }));<% } %>
});<% } %><% if (releaseModule) { %>

gulp.task('bump', ['test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});<% } %>

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});

gulp.task('test', ['lint', <% if (istanbulModule) { %>'istanbul'<% } else { %>'unitTest'<% } %>]);<% if (releaseModule) { %>

gulp.task('release', ['bump']);<% } %>

gulp.task('dist', function () {
  return gulp.src(paths.coffee, {base: '.'})
    .pipe(plugins.coffee({bare: true})).on('error', plugins.util.log)
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['test', 'dist']);
