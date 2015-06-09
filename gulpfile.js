'use strict';


var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var util = require('util');


var options = {
    //src: 'src',
    app: 'app',
    dist: 'dist',
    tmp: '.tmp',
    errorHandler: function (title) {
        return function (err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    },
    wiredep: {
        directory: 'bower_components'
    }
};

wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});