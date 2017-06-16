var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel'); 
var runSequence = require('run-sequence'); 

gulp.task('cssCompile', function () {
    gulp.src('src/scss/stylesheet.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});


gulp.task('runSequence', function() {
    runSequence(
        'jsMinify',
        'jsConcat'
    );
})
gulp.task('jsMinify', function() {
    gulp.src('./src/app.js') 
        .pipe(babel({
            presets: ['es2015']
        })) 
        .pipe(uglify()) 
        .pipe(gulp.dest('./build/'))
});
gulp.task('jsConcat', function() {
    gulp.src(['./node_modules/pixi.js/dist/pixi.min.js', './build/app.js'])   
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./dist/js/'))
}); 
//Watch task
gulp.task('default', function () {
    gulp.watch('src/scss/**/*.scss', ['cssCompile']);
    gulp.watch('src/**/*.js', ['runSequence']);
});