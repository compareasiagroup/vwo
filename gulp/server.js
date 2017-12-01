var path = require("path");
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var config = require("../config");

var cors = function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
};

gulp.task("server", function(done) {
  $.connect.server({
    port: 3009,
    root: config.dist,
    livereload: true,
    fallback: path.resolve(config.dist, "index.html"),
    middleware: function() {
      return [cors];
    }
  });

  done();
});
