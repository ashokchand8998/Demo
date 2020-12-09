//not understood and not working

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(cb) {
  gulp
    .src('public\scss\index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      gulp.dest(function(f) {
        return f.base;
      })
    );
  cb();
});

//compile and watch
gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('*.scss', gulp.series('sass'));
    cb();
  })
);