var gulp = require("gulp");
var template = require("gulp-template");
var config = require("../config");

gulp.task("templates", function() {
  return gulp.src(config.indexHtmlPath).pipe(gulp.dest(config.dist));
});
