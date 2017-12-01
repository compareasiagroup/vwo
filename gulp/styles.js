var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var config = require("../config");

gulp.task("styles", function() {
  return gulp
    .src(config.mainSassPath)
    .pipe($.plumber())
    .pipe($.sassGlob())
    .pipe($.sass().on("error", $.sass.logError))
    .pipe($.concat(config.distFileName + ".css"))
    .pipe(gulp.dest(config.dist))
    .pipe($.connect.reload());
});
