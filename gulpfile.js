var gulp    = require('gulp'),
    flatten = require('gulp-flatten'),
    concat  = require('gulp-concat'),
    less    = require('gulp-less'),
    coffee  = require('gulp-coffee'),
    watch   = require('gulp-watch'),
    extend  = require('gulp-extend'),
    wrap    = require('gulp-wrap'),
    ngAnnotate = require('gulp-ng-annotate'),
    path    = './bower_components/';

/* Templates Task
  ------------------------------------------------- */
gulp.task('templates', function() {
  gulp
    .src(['./src/js/**/*.html', './src/js/_common/**/*.html'])
    .pipe(flatten())
    .pipe(gulp.dest('./release/templates'));
});

gulp.task('app-scripts', function() {
  var sources = [
    './src/js/config/*.js',
    './src/js/plugins/*.js',
    './src/js/app.js',
    './src/js/base/**/*.js',
    './src/js/asesor/**/*.js',
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

/* Frameworks Copy Task
  ------------------------------------------------- */
gulp.task('framework-copy', function() {

  gulp.src([
    path + '/**/*.min.js',
    path + '/**/*-min.js',
    path + '/**/*.min.js.map'
  ])
  .pipe(gulp.dest('./release/js/'));

  gulp
    .src([path + 'angular-validation/locales/**/*.json'])
    .pipe(gulp.dest('./release/js/locales/'))

  gulp
    .src([path + 'ionicons/fonts/*'])
    .pipe(gulp.dest('./release/fonts/'));

   gulp
    .src(['./src/js/meta/**/*.js'])
    .pipe(gulp.dest('./release/js/meta'));

  gulp
    .src([path + 'ionicons/css/ionicons.min.css'])
    .pipe(gulp.dest('./release/css/'));
});

gulp.task('frameworks-less', function() {
  gulp
    .src(path + 'bootstrap/less/normalize.less')
    .pipe(less({compress: true}))
    .pipe(concat('normalize.min.css'))
    .pipe(gulp.dest('release/css'));

  gulp
    .src(path + 'bootstrap/less/print.less')
    .pipe(less({compress: true}))
    .pipe(concat('print.min.css'))
    .pipe(gulp.dest('release/css'));

  gulp
    .src('./src/less/bootstrap.less')
    .pipe(less({compress: true}))
    .pipe(concat('bootstrap.min.css'))
    .pipe(gulp.dest('release/css'));
});

gulp.task('watch', function() {
  gulp.watch('./src/less/*.less', ["app-less"]);
  gulp.watch('./src/js/**/*.html', ["templates"]);
  gulp.watch('./src/js/**/*.js', ["app-scripts"]);
});

gulp.task('framework', ['framework-copy', 'frameworks-less']);
gulp.task('app', ['app-scripts', 'app-less']);
gulp.task('build', ['framework', 'default']);
gulp.task('default', ['templates', 'app']);
