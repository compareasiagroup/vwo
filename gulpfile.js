var gulp = require("gulp");
var requireDir = require("require-dir");

// helper to require directories
requireDir("./gulp");

// client-side Gulp tasks
gulp.task("build", ["scripts", "templates"]);

gulp.task("start", ["server", "build", "watch"]);
gulp.task("default", ["start"]);
