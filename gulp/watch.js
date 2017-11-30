var gulp = require("gulp");
var config = require("../config");

// Watch task
gulp.task("watch", ["build"], function() {
  gulp.watch(config.scripts, ["scripts"]);
  gulp.watch(config.templates, ["scripts"]);
  // gulp.watch(config.styles, ['styles']);
  gulp.watch([config.src + "/*.html"], ["templates"]);
});
