var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var es = require("event-stream");
var uglify = require("gulp-uglify");
var templateCache = require("gulp-angular-templatecache");
var config = require("../config");

gulp.task("scripts", function() {
  var js = gulp.src(config.scripts);

  var templates = gulp.src(config.templates).pipe(
    templateCache({
      module: config.appModule
    })
  );

  return es
    .merge(js, templates)
    .pipe($.concat(config.distFileName + ".js"))
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(config.dist));
});
