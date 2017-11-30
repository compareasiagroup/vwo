if (typeof vwo_$ !== "undefined") {
  var $ = vwo_$;
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

var host = "https://staging.moneymax.ph";

// ------ HERE BEGINS THE ANGULAR APP --------
var app = angular.module("abTestApp", []);
var bootstrap = function() {
  angular.bootstrap($(document), ["abTestApp"]);
};
