var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    sass = require('gulp-sass');

var PATH = {
    input : './src/js/app.js',
    outputPath : './static/js/',
    outputFile : 'creports.js',
    lib : './bower_components/',
    watchJS : ['src/js/**', 'bower_components/**/*.js'],
    watchSCSS : ['bower_components/**/*.{sass,css}', 'src/scss/**'],
}

var libs = [
    PATH.lib + 'd3',
    PATH.lib + 'topojson',
    PATH.lib + 'datamaps/dist',
    PATH.lib + 'jquery/dist/',
    PATH.lib + 'normalize.css'
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
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./static/css'));
});

gulp.task('default', ['watch']);

gulp.task('browserify', function() {
    browserify(PATH.input, {
        paths: libs})
        .bundle()
        .pipe(source(PATH.outputFile))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest(PATH.outputPath))
});
