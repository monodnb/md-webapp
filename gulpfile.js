'use strict';

var gulp = require('gulp');
//var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var $ = require('gulp-load-plugins')({
    pattern: ['browser-sync-*', 'gulp', 'gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'util']
});


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

var wiredep = require('wiredep').stream;


gulp.task('inject', ['scripts', 'jq', 'styles'], function () {
    var injectStyles = gulp.src([
      options.tmp + '/serve/styles/style.css'
    ], {
        read: false
    });


    var injectJqScripts = gulp.src([
      options.tmp + '/serve/jq/**/*.js'
    ], {
        read: false
    });

    var injectNgScripts = gulp.src([
      options.tmp + '/serve/scripts/**/*.js'
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
        name: 'injectNg'
    };
    var injectJqOptions = {
        ignorePath: [options.app, options.tmp + '/serve'],
        addRootSlash: false,
        name: 'injectJq'
    };

    return gulp.src(options.app + '/*.html')
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectJqScripts, injectJqOptions))
        .pipe($.inject(injectNgScripts, injectNgOptions))
        .pipe(wiredep(options.wiredep))
        .pipe(gulp.dest(options.tmp + '/serve'));
});


gulp.task('partials', function () {
    return gulp.src([
      options.app + '/**/*.html',
      options.tmp + '/serve/**/*.html'
    ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'materialWebapp',
            root: 'app'
        }))
        .pipe(gulp.dest(options.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', {
        read: false
    });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: options.tmp + '/partials',
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({
            preserveComments: $.uglifySaveLicense
        })).on('error', options.errorHandler('Uglify'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(options.dist + '/'))
        .pipe($.size({
            title: options.dist + '/',
            showFiles: true
        }));
});

gulp.task('jq', function () {

    return gulp.src([
        options.app + '/js/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(browserSync.reload({
            stream: true 
        }))
        .pipe($.size())
        .pipe($.concat('jq-scripts.js'))
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.tmp + '/serve/jq/'));
});


gulp.task('scripts', function () {

    return gulp.src([
        options.app + '/scripts/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.size())
        .pipe($.concat('ng-scripts.js'))
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.tmp + '/serve/scripts/'));
});

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
        .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(options.tmp + '/serve/styles/'))
        .pipe(browserSync.reload({
            stream: true 
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(options.dist + '/fonts/'));
});

gulp.task('fontconvert', function () {
    return gulp.src([
      options.app + '/fonts/**/*.ttf'
    ])
        .pipe($.ttf2woff())
        .pipe(gulp.dest(options.dist + '/fonts/'));
});

gulp.task('other', ['fontconvert'], function () {
    return gulp.src([
      options.app + '/**/*',
      '!' + options.app + '/**/*.{html,css,js,scss,ttf}'
    ])
        .pipe(gulp.dest(options.dist + '/'));
});

gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], done);
});

gulp.task('build', ['html', 'fonts', 'other']);

function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if (baseDir === options.app || (util.isArray(baseDir) && baseDir.indexOf(options.app) !== -1)) {
        routes = {
            '/bower_components': 'bower_components'
        };
    }

    var server = {
        baseDir: baseDir,
        routes: routes
    };

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser
    });
}

browserSync.use(browserSyncSpa({
    selector: '[ng-app]' // Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
    browserSyncInit([options.tmp + '/serve', options.app]);
});

gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
});


function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

    gulp.watch([options.app + '/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.app + '/**/*.css',
      options.app + '/**/*.scss'
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('styles');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(options.app + '/**/*.js', function (event) {
        if (isOnlyChange(event)) {
            gulp.start('scripts');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(options.app + '/**/*.html', function (event) {
        browserSync.reload(event.path);
    });
});




gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
