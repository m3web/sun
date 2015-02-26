var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    webserver = require('gulp-webserver'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch');

var srcDir = './src/';
var destDir = './dest/'


gulp.task('styles', function() {
    gulp.src(srcDir + 'less/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir + 'css'));
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
        open: true
    }));
});

gulp.task('default', function () {
    watch(srcDir + 'less/**/*.less', function (files, cb) {
        gulp.start('styles', cb);
    });
})