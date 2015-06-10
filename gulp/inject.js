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

        var injectJs = gulp.src([
          options.app + '/js/components/*.js',
            options.app + '/js/main.js'
        ], {
            read: false,
            name: 'javascript'
        });

        var injectNg = gulp.src([
          options.app + '/scripts/components/*.js',
            options.app + '/scripts/*.js'
        ], {
            read: false
        });

        var injectOptions = {
            ignorePath: [options.app, options.tmp + '/serve'],
            addRootSlash: false
        };

        var injectNgOptions = {
            ignorePath: [options.app, options.tmp + '/serve'],
            addRootSlash: false,
            name: 'angular'
        };

        var injectJsOptions = {
            ignorePath: [options.app, options.tmp + '/serve'],
            addRootSlash: false,
            name: 'javascript'
        };

        return gulp.src(options.app + '/*.html')
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectJs, injectJsOptions))
            .pipe($.inject(injectNg, injectNgOptions))
            .pipe(wiredep(options.wiredep))
            .pipe(gulp.dest(options.tmp + '/serve'));
    });

};
