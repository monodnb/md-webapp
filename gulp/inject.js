'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {

    gulp.task('inject', ['scripts', 'styles'], function () {
        var injectStyles = gulp.src([
          options.tmp + '/serve/styles/style.css'
        ], {
            read: false
        });

        var injectScripts = gulp.src([
          options.app + '/scripts/modules/*.js',
            options.app + '/scripts/main.js'
        ], {
            read: false
        });

        var injectOptions = {
            ignorePath: [options.app, options.tmp + '/serve'],
            addRootSlash: false
        };

        return gulp.src(options.app + '/*.html')
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            .pipe(wiredep(options.wiredep))
            .pipe(gulp.dest(options.tmp + '/serve'));
    });

};