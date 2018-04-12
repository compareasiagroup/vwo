// vwo has built in jquery
if (typeof vwo_$ !== "undefined") {
  var $ = vwo_$;
}

if (typeof isLocal === "undefined") {
  var isLocal = true;
}
var $bannerContainer = $(".carinsurance-landing").find(".item.ci");

$bannerContainer.prepend('<div class="promo-banner"><div class="container"><img class="hidden-xs" src="https://www.moneymax.ph/s3/philippines/moneymax.ph/production/ph/images/general/ci-promo-desktop.jpg"><img class="visible-xs" src="https://www.moneymax.ph/s3/philippines/moneymax.ph/production/ph/images/general/ci-promo-mobile.jpg"></div></div>');
var $ctaBtn = $(".hero-carousel__item__cta");
$ctaBtn.addClass("visible-xs");

var $left = $(".default-landing").first();
var $right = $(".hero-carousel__item__row").find(".col-lg-5");
$left.removeClass("col-lg-7 col-md-7").addClass("col-lg-6 col-md-6");

$right
  .removeClass("col-lg-5 col-md-5 hidden-xs hidden-sm")
  .addClass("col-lg-6 col-md-6 hidden-xs")
  .html("<ab-widget></ab-widget>");

// in local, we can't get the API work
var host = isLocal
  ? "https://www.moneymax.ph"
  : location.origin;

// ------ HERE BEGINS THE ANGULAR APP --------
var app = angular.module("abTestApp", []);
var bootstrap = function() {
  angular.bootstrap($(document), ["abTestApp"]);
};
