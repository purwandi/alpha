var gulp    = require('gulp'),
    flatten = require('gulp-flatten'),
    concat  = require('gulp-concat'),
    less    = require('gulp-less'),
    coffee  = require('gulp-coffee'),
    watch   = require('gulp-watch'),
    extend  = require('gulp-extend'),
    wrap    = require('gulp-wrap'),
    ngAnnotate = require('gulp-ng-annotate'),
    templates = require('gulp-angular-templatecache'),
    path    = './bower_components/';

/* Templates Task
  ------------------------------------------------- */
gulp.task('templates', function() {
  gulp
    .src(['./src/js/**/*.html', './src/js/_common/**/*.html'])
    .pipe(flatten())
    .pipe(gulp.dest('./release/templates'));
});

gulp.task('html', function() {
    return gulp.src(['./src/js/**/*.html', './src/js/_common/**/*.html'])
        .pipe(flatten())
        .pipe(templates({
            root: '/templates/',
            standalone: true
        }))
        .pipe(gulp.dest('./release/js/'));
});

gulp.task('app-scripts', function() {
  var sources = [
    './src/js/config/*.js',
    './src/js/plugins/*.js',
    './src/js/app.js',
    './src/js/*.js',
    './src/js/directives/*.js',
    './src/js/base/**/*.js',
    './src/js/asesor/app.js',
    './src/js/asesor/*.js',
    './src/js/asesor/**/*.js',
    './src/js/sekolah/app.js',
    './src/js/sekolah/router.js',
    './src/js/sekolah/**/*.js'
  ];

  gulp
    .src(sources)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./release/js/'));

  // gulp
  //  .src('./public/js/app.js')
  //  .pipe(concat('app.min.js'))
  //  .pipe(ngAnnotate({add: true}))
  //  .pipe(gulp.dest('./public/js/'));
});

gulp.task('app-less', function() {
  gulp
    .src('./src/less/app.less')
    .pipe(less({compress: false}))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('release/css'));
});

gulp.task('watch', function() {
  gulp.watch('./src/less/*.less', ["app-less"]);
  gulp.watch('./src/js/**/*.html', ["templates", "html"]);
  gulp.watch('./src/js/**/*.js', ["app-scripts"]);
});

gulp.task('app', ['app-scripts', 'app-less']);
gulp.task('build', ['default']);
gulp.task('default', ['templates', 'app', 'html']);
