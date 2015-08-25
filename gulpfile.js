var project = require('./package.json'),
    gulp = require('gulp');
    sass = require('gulp-sass'),
    neat = require('node-neat'),
    normalize = require('node-normalize-scss'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace');

// Styles
gulp.task('sass', function () {
  var now = new Date();

  gulp.src('./public/assets/src/sass/**/*.scss')
    .pipe(sass({
      'includePaths': ['styles'].concat(neat.includePaths, normalize.includePaths)
    }))
    .pipe(replace('{{timestamp}}', now.toString()))
    .pipe(replace('{{version}}', project.version))
    .pipe(gulp.dest('./public/assets/build/css/'));
});

// Javascript
gulp.task('js', function() {
  gulp.src(['./public/assets/src/js/*.js', '!./public/assets/src/js/main.js'])
    .pipe(uglify({
      'preserveComments': 'some'
    }))
    .pipe(gulp.dest('./public/assets/build/js/'));

  gulp.src(['./public/assets/src/js/vendors/*.js', './public/assets/src/js/modules/*.js', './public/assets/src/js/main.js'])
    .pipe(uglify({
      'preserveComments': 'some'
    }))
    .pipe(concat('main.js', { 'newLine': '\r\n\r\n' }))
    .pipe(gulp.dest('./public/assets/build/js/'));
});

// Images
gulp.task('img', function() {
  gulp.src('./public/assets/src/img/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(imagemin({
      'optimizationLevel': 5,
      'interlaced': true
    }))
    .pipe(gulp.dest('./public/assets/build/img/'));
});

// Watch
gulp.task('watch', function() {
  // watch style files
  gulp.watch('./public/assets/src/sass/**/*.scss', ['sass']);
  // Watch script files
  gulp.watch('./public/assets/src/js/**/*.js', ['js']);
  // Watch image files
  gulp.watch('./public/assets/src/img/*.{jpg,jpeg,png,gif,svg}', ['img']);
});

gulp.task('default', ['sass', 'js', 'img', 'watch']);