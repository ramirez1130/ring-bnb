'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    bs = require('browser-sync').create();

sass.compiler = require('node-sass');

// Scss to css
gulp.task('sass', function () {
    return gulp.src('main/assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('main/assets/css'))
        .pipe(bs.reload({stream: true}));
});

// pug to html
gulp.task('pug', function () {
    return gulp.src('main/assets/pug/pages/**/*.pug')
        .pipe(pug({ pretty: true }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('main/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch('main/assets/scss/**/*.scss', ['sass']);
    gulp.watch('main/assets/pug/pages/**/*.pug', ['pug']);
    gulp.watch("*.*").on('change', bs.reload);
});

gulp.task('browser-sync',['watch'], function() {
    bs.init({
        proxy: "localhost/all_live_thems/Themeforest/tovo/html/v3.1/upload/theme"
    });
});

gulp.task('default', [ 'sass', 'pug', 'watch', 'browser-sync' ]);