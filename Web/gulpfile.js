var gulp = require('gulp');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');


gulp.task("ys", function () {
    return gulp.src("build/PIEWEB.js")// ES6 源码存放的路径
      .pipe(babel())
      .pipe(uglify())
      .pipe(gulp.dest("build/min"))
});

