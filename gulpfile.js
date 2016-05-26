var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var htmlToJs = require('gulp-html-to-js');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var copy = require('gulp-contrib-copy');
var webserver = require('gulp-webserver');
var wrap = require("gulp-wrap");
var wrapUmd = require('gulp-wrap-umd');

var paths = {
    scripts: [
        'src/js/docmana.js',
        'src/js/kernel/core.js',
        'src/js/kernel/utils.js',
        'src/js/templates.js',
        'src/js/kernel/app.js',
        'src/js/kernel/clipboard.js',
        'src/js/kernel/history.js',
        'src/js/kernel/mime.js',
        'src/js/kernel/resource.js',
        'src/js/kernel/store.js',
        'src/js/kernel/template.js',
        'src/js/kernel/plugins.js',
        'src/js/commands/**/*.js',
        'src/js/ui/**/*.js',
        'src/js/i18n/**/*.js'
    ],
    vendorScripts: ['src/js/vendor/**/*.js'],
    liteVendorScripts: [
      'src/js/vendor/date.format.js',
      'src/js/vendor/jquery.autosize.input.js',
      'src/js/vendor/jquery.fileDownload.js',
      'src/js/vendor/jquery.hotkeys.js'
    ],
    images: 'src/img/**/*'
};

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('templates', function () {
    return gulp.src('src/tpl/**/*')
        .pipe(htmlToJs({ global: 'window.docmana.templates', concat: 'templates.js' }))
        .pipe(gulp.dest('src/js'));
});

gulp.task('scripts', ['templates', 'clean'], function () {
    var contents = [
        {
            src: paths.vendorScripts.concat(paths.scripts),
            dest: 'docmana'
        }
        //, {
        //    src: paths.liteVendorScripts.concat(paths.scripts),
        //    dest: 'docmana.lite'
        //}
    ];
    contents.forEach(function (cnt) {
        gulp.src(cnt.src)
         .pipe(sourcemaps.init())
         .pipe(concat(cnt.dest + '.js'))
         .pipe(wrapUmd({
             deps: [
                 { name: 'jquery', globalName: 'jQuery', paramName: '$' },
                 { name: 'lodash', globalName: '_', paramName: '_' },
                 { name: 'backbone', globalName: 'Backbone', paramName: 'Backbone' },
                 { name: 'bootstrap', globalName: 'undefined', paramName: 'undefined' }
             ],
             exports: 'window.docmana',
             namespace: 'docmana'
         }))
         .pipe(gulp.dest('dist/js'))
         .pipe(rename(cnt.dest + '.min.js'))
         .pipe(uglify())
         .pipe(sourcemaps.write('./'))
         .pipe(gulp.dest('dist/js'));
    });
});

gulp.task('images', ['clean'], function () {
    return gulp.src(paths.images)
        //.pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(copy())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('less', ['clean'], function () {
    var lessFiles = ['src/less/docmana.less', 'src/less/docmana-ie.less'];
    lessFiles.forEach(function (file) {
        gulp.src(file)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/css'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(cssmin())
            .pipe(gulp.dest('dist/css'));
    });
});

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});


gulp.task('default', ['images', 'less', 'scripts']);