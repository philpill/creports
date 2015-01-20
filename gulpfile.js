var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

var PATH = {
    input : './src/js/app.js',
    outputPath : './static/js/',
    outputFile : 'grid.js',
    lib : './bower_components/',
    watchGlob : ['src/js/**', 'bower_components/**']
}

var libs = [
    PATH.lib + 'd3',
    PATH.lib + 'topojson',
    PATH.lib + 'datamaps/dist',
    PATH.lib + 'jquery/dist/'
];

gulp.task('watch', function () {
    watch(PATH.watchGlob, function () {
        gulp.start('browserify');
    });
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
