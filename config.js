var path = require("path");
var argv = require("yargs").argv;

var src = argv.src;
var app = argv.app; // app module name, for templateCache

if (!src || !app) {
  console.error(
    "ERROR! Please specify app src, e.g. \ngulp build --src ./ph/ci/landing_page --app-name abTestApp"
  );
  process.exit(1);
}

var config = {
  src: argv.src,
  appModule: app,
  dist: path.resolve(__dirname, "./dist", src),
  distFileName: "app", // dist files will be named as app.js app.css
  indexHtmlPath: path.resolve(__dirname, src, "index.html"),
  // gulp
  scripts: [src + "/**/*.js", "./bootstrap.js"],
  templates: [src + "/components/**/*.html"],
  styles: [src + "/**/*.sass"],
  mainSassPath: src + "/main.sass"
};

module.exports = config;
