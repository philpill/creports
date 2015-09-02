var gulp = require('gulp'),
    concat = require('gulp-concat'),
    aliasify = require('aliasify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    sass = require('gulp-sass'),
    glob = require('glob');

var PATH = {
    input : './src/js/**/*.js',
    outputPath : './static/js/',
    outputFile : 'creports.js',
    lib : './node_modules/',
    watchJS : ['src/js/**', 'node_modules/**/*.js'],
    watchSCSS : ['node_modules/**/*.{sass,css}', 'src/scss/**/*.scss'],
}

var libs = [
    PATH.lib + 'd3',
    PATH.lib + 'topojson',
    PATH.lib + 'datamaps/dist',
    PATH.lib + 'jquery/dist',
    PATH.lib + 'lodash',
    PATH.lib + 'normalize.css',
    PATH.lib + 'backbone',
    PATH.lib + 'backbone.marionette/lib'
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
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./static/css'));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*').pipe(gulp.dest('./static/fonts'));
});

gulp.task('default', ['fonts', 'sass', 'browserify', 'watch']);

gulp.task('browserify', function() {
    return browserify(glob.sync(PATH.input), {
        paths: libs})
        .transform(aliasify, {global: true})
        .bundle()
        .pipe(source(PATH.outputFile))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest(PATH.outputPath))
});
