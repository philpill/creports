var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var sass = require('gulp-sass');

var PATH = {
    input : './src/js/app.js',
    outputPath : './static/js/',
    outputFile : 'grid.js',
    lib : './bower_components/',
    watchJS : ['src/js/**', 'bower_components/**'],
    watchSCSS : 'src/scss/**',
}

var libs = [
    PATH.lib + 'd3',
    PATH.lib + 'topojson',
    PATH.lib + 'datamaps/dist',
    PATH.lib + 'jquery/dist/'
];

gulp.task('watch', function () {
    watch(PATH.watchJS, function () {
        gulp.start('browserify');
    });
    watch(PATH.watchSCSS, function () {
        gulp.start('sass');
    });
});

gulp.task('sass', function () {
    gulp.src(PATH.watchSCSS)
        .pipe(sass())
        .pipe(gulp.dest('./static/css'));
});

gulp.task('default', ['watch']);

gulp.task('browserify', function() {
    browserify(PATH.input, {
        paths: libs})
        .bundle()
        .pipe(source(PATH.outputFile))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(PATH.outputPath))
});
