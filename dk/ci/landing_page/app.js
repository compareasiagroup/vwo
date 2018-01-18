// vwo has built in jquery
if (typeof vwo_$ !== "undefined") {
  var $ = vwo_$;
}

// isLocal is set to `false` in VWO by us
if (typeof isLocal === "undefined") {
  var isLocal = true;
}

var bgImageUrl =
  "//www.samlino.dk/s3/denmark/samlino.dk/production/dk/images/general/xdesktop-background.jpg.pagespeed.ic.tMrOI2ButK.webp";

// remove little car & tree background image
$(".hero-carousel_item .container").css("background", "none");

// add full screen background iamge
$(".hero-carousel_item").css("background-image", "url(" + bgImageUrl + ")");

var $container = $(".hero-carousel__item__row");

$container.html("<ab-widget></ab-widget>");

// in local, we can't get the API work
var host = isLocal ? "http://denmark-qa.compareglobal.co.uk" : location.origin;

// ------ HERE BEGINS THE ANGULAR APP --------
var app = angular.module("abTestApp", []);
var bootstrap = function() {
  angular.bootstrap($(document), ["abTestApp"]);
};
