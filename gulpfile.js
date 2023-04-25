const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');


function buildStyles() {
  return gulp.src('./src/css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(prefix({
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
};

function copyImages() {
  return gulp.src('./src/images/**/*').pipe(gulp.dest('./dist/images'))
}

function copyHtml() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'))
}

exports.buildStyles = buildStyles;

function watch() {
  gulp.watch('./src/images/**/*', {
    events: 'all'
  }, (path, stats) => {
    console.log('copy images')
    copyImages();
  });
  const cssWatcher = gulp.watch('src/css/*.scss');
  cssWatcher.on('change', function (path, stats) {
    buildStyles();
  });
  const htmlWatcher = gulp.watch('src/*.html');
  htmlWatcher.on('change', function (path, stats) {
    copyHtml()
  });
}

exports.watch = watch

exports.build = async function () {
  await copyImages()
  await buildStyles()
  await copyHtml()
}

exports.webserver = function () {
  watch()
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }));
}