var gulp=require('gulp');
var stylus= require('gulp-stylus');

gulp.task('stylus',function(){
    return gulp.src('./public/stylus/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./public/css/'));
});
gulp.task('watchStylus',function(done){
    gulp.watch('./public/stylus/**/*.styl',['stylus']);
    done();
});