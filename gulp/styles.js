var gulp = require("gulp");
var concat = require("gulp-concat");
var config = require("../config");

gulp.task("styles", function() {
  return gulp
    .src(config.styles)
    .pipe(concat(config.distFileName + ".css"))
    .pipe(gulp.dest(config.dist));
});
