'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {


    gulp.task('styles', function () {

        var sassOptions = {
            style: 'expanded'
        };

        var injectFiles = gulp.src([
      options.app + '/styles/style.scss',
    ], {
            read: false
        });

        var injectOptions = {
            transform: function (filePath) {
                filePath = filePath.replace(options.app + '/styles/', '');
                return '@import \'' + filePath + '\';';
            },
            starttag: '// injector',
            endtag: '// endinjector',
            addRootSlash: false
        };

        var indexFilter = $.filter('style.scss');

        return gulp.src([
      options.app + '/styles/style.scss'
    ])
            .pipe(indexFilter)
            .pipe($.inject(injectFiles, injectOptions))
            .pipe(indexFilter.restore())
            .pipe($.sourcemaps.init())
            .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
            .pipe($.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })).on('error', options.errorHandler('Autoprefixer'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(options.tmp + '/serve/styles/'))
            .pipe(browserSync.reload({
                stream: true 
            }));
    });

};