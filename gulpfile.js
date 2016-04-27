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

var paths = {
    scripts: [
        'src/js/docmana.js',
        'src/js/templates.js',
        'src/js/kernel/core.js',
        'src/js/kernel/templateHelper.js',
        'src/js/kernel/app.js',
        'src/js/kernel/clipboard.js',
        'src/js/kernel/history.js',
        'src/js/kernel/mime.js',
        'src/js/kernel/resource.js',
        'src/js/kernel/store.js',
        'src/js/kernel/template.js',
        'src/js/kernel/utils.js',
        'src/js/kernel/plugins.js',
        'src/js/commands/**/*.js',
        'src/js/ui/**/*.js',
        'src/js/i18n/**/*.js'
    ],
    vendorScripts: ['src/js/vendor/**/*.js'],
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
    return gulp.src(paths.vendorScripts.concat(paths.scripts))
        .pipe(sourcemaps.init())
        .pipe(concat('docmana.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('docmana.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', ['clean'], function () {
    return gulp.src(paths.images)
      //.pipe(imagemin({ optimizationLevel: 5 }))
      .pipe(copy())
      .pipe(gulp.dest('dist/img'));
});

gulp.task('less', ['clean'], function () {
    return gulp.src('src/less/docmana.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});


gulp.task('default', ['images', 'less', 'scripts']);