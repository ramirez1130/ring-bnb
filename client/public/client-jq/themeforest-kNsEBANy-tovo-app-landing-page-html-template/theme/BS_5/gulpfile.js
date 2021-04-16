const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

//scss to css
function style() {
  return gulp.src('main/assets/scss/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({
      //outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('main/assets/css'));
}

// pug to html
function html() {
  return gulp.src('main/assets/pug/pages/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('main/'))
    .pipe(browserSync.reload({
      stream: true
    }));
}




// Watch function
function watch() {
  browserSync.init({
    proxy: 'http://localhost/tovo/theme/main/ltr/index.html'
  });
  gulp.watch('main/assets/scss/**/*.scss', style);
  gulp.watch('main/assets/pug/pages/**/*.pug', html);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('main/assets/css/*.css').on('change', browserSync.reload);
}

exports.style = style;
exports.html = html;
exports.watch = watch;


const build = gulp.series(watch);
gulp.task('default', build, 'browser-sync');