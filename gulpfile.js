const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

gulp.task('sass', function() {
    return gulp.src("frontend/public/scss/index.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("frontend/public/css"))
});

gulp.task('watch', function() {
    gulp.watch("frontend/public/scss/index.scss", gulp.parallel(['sass']));
});

gulp.task('default', gulp.parallel(['sass', 'watch']));