// vwo has built in jquery
if (typeof vwo_$ !== "undefined") {
  var $ = vwo_$;
}

if (typeof isLocal === "undefined") {
  var isLocal = true;
}

var $ctaBtn = $(".hero-carousel__item__cta");
$ctaBtn.hide();

var $left = $(".default-landing").first();
var $right = $(".hero-carousel__item__row").find(".col-lg-5");
$left.removeClass("col-lg-7 col-md-7").addClass("col-lg-6 col-md-6");

$right
  .removeClass("col-lg-5 col-md-5 hidden-xs hidden-sm")
  .addClass("col-lg-6 col-md-6")
  .html("<ab-widget></ab-widget>");

// in local, we can't get the API work
var host = isLocal
  ? "http://philippines-qa.compareglobal.co.uk"
  : location.host;

// ------ HERE BEGINS THE ANGULAR APP --------
var app = angular.module("abTestApp", []);
var bootstrap = function() {
  angular.bootstrap($(document), ["abTestApp"]);
};
