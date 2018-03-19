// vwo has built in jquery
if (typeof vwo_$ !== "undefined") {
  var $ = vwo_$;
}

if (typeof isLocal === "undefined") {
  var isLocal = true;
}
var $bannerContainer = $(".carinsurance-landing").find(".ci");

$bannerContainer.prepend('<div class="promo-banner"><div class="container"><img class="hidden-xs" src="http://assets.ciab.compareglobal.co.uk/philippines/moneymax.ph/preview/ph/images/general/ci-promo-desktop.jpg"><img class="visible-xs" src="http://assets.ciab.compareglobal.co.uk/philippines/moneymax.ph/preview/ph/images/general/ci-promo-mobile.jpg"></div></div>');
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

app.factory("abHelper", function() {
  var abHelper = {};
  abHelper.queryToObject = function(queryString) {};

  abHelper.objectToQuery = function(queryObj) {
    return Object.keys(queryObj).reduce(function(prev, key) {
      return prev + "&" + key + "=" + queryObj[key];
    }, "");
  };

  abHelper.isMobile = function() {
    return window.innerWidth < 768;
  };

  return abHelper;
});

app.factory("abTestService", ["$http", "abHelper", function($http, abHelper) {
  var service = {};
  service.request = function(url, queryObj) {
    queryObj = queryObj || {};
    var queryString = abHelper.objectToQuery(queryObj);
    return $http.get(url + "?" + queryString).then(function(response) {
      return response.data;
    });
  };

  return service;
}]);

app
  .directive("abDropdown", function() {
    return {
      replace: true,
      scope: {
        model: "=?",
        options: "=?",
        items: "=?",
        dependOn: "=?",
        watchOn: "=?",
        apiHandler: "&?"
      },
      controller: "abDropdownController",
      templateUrl: "dropdown/dropdown.html",
      link: function(scope, element, attrs) {
        scope.spinnerOptions = {
          color: "grey"
        };

        scope.items = [];
        var handler = attrs.apiHandler ? scope.apiHandler() : null;

        scope.$watch("model", function(val, old) {
          if (!old && val) {
            scope.options.showError = false;
          }
        });

        if (attrs.dependOn && attrs.watchOn) {
          scope.$watch("watchOn", function(val) {
            scope.items = [];
            scope.model = "";
            var isValid = val;

            if (isValid && handler) {
              scope.showSpinner = true;
              handler(scope.dependOn).then(function(data) {
                scope.items = data[scope.options.key];
                scope.showSpinner = false;
              });
            }
          });
        } else if (handler) {
          scope.showSpinner = true;
          handler().then(function(data) {
            scope.items = data[scope.options.key];
            scope.showSpinner = false;
          });
        }
      }
    };
  })
  .controller("abDropdownController", ["$scope", function($scope) {}]);

angular.module('abTestApp').run(['$templateCache', function($templateCache) {$templateCache.put('dropdown/dropdown.html','<div class="select__container" ng-class="{\'select__container-disabled\' : options.disabled || !items.length, \'error\': options.showError}">\n\t<span class="select__container-text">{{model ? (options.modelKey ? model[options.modelKey] : model) : options.placeholder}}</span>\n  \t<select ng-model="model"\n  \t\t\tclass="select__dropdown-box"\n\t\t\tng-disabled="options.disabled || !items.length">\n\t    <option value="" disabled selected ng-if="options.placeholder">{{options.placeholder}}</option>\n\t    <option ng-repeat="item in items" ng-value="item">{{options.modelKey ? item[options.modelKey]:item}}</option>\n  \t</select>\n\t<div class="select__spinner-container" ng-show="showSpinner">\n\t    <ab-spinner options="spinnerOptions"></ab-spinner>\n\t</div>\n</div>\n');
$templateCache.put('spinner/spinner.html','<span class="cgg-spinner" ng-class="{\'cgg-spinner__{{options.color}}\': options.color}">\n    <span class="sk-placeholder" ng-show="options.placeholder" ng-class="{\'sk-placeholder__{{options.size}}\': options.size}" style="float: {{options.placeholder.position ? options.placeholder.position : \'left\'}}">{{options.placeholder}}</span>\n    <div class="sk-circle" ng-class="{\'sk-circle__{{options.size}}\': options.size}">\n        <div class="sk-circle1 sk-child"></div>\n        <div class="sk-circle2 sk-child"></div>\n        <div class="sk-circle3 sk-child"></div>\n        <div class="sk-circle4 sk-child"></div>\n        <div class="sk-circle5 sk-child"></div>\n        <div class="sk-circle6 sk-child"></div>\n        <div class="sk-circle7 sk-child"></div>\n        <div class="sk-circle8 sk-child"></div>\n        <div class="sk-circle9 sk-child"></div>\n        <div class="sk-circle10 sk-child"></div>\n        <div class="sk-circle11 sk-child"></div>\n        <div class="sk-circle12 sk-child"></div>\n    </div>\n</span>');
$templateCache.put('button/button.html','<a class="car-selector-button"\n   ng-class="{\'disabled\': options.showSpinner}">\n  <div ng-transclude\n       ng-if="!options.showSpinner"></div>\n  <ab-spinner ng-if="options.showSpinner"></ab-spinner>\n</a>\n');
$templateCache.put('widget/widget.html','<div class="car-selector-container" id="ab-test-app">\n  <div class="car-selector-title">\n    <h3>Get an Instant quote now !</h3>\n    <p>Tell us your car model, we\u2019ll tell you the best deal:</p>\n  </div>\n\n  <div class="row">\n    <div class="col-lg-6">\n      <ab-dropdown model="carBrand"\n                   options="carBrandDropdown"\n                   api-handler="getDropdownItem()">\n      </ab-dropdown>\n    </div>\n\n    <div class="col-lg-6">\n      <ab-dropdown model="carModel"\n                   options="carModelDropdown"\n                   depend-on="{brand: carBrand}"\n                   watch-on="carBrand"\n                   api-handler="getDropdownItem()">\n      </ab-dropdown>\n    </div>\n  </div>\n\n  <div class="row margin-bottom">\n    <div class="col-lg-6">\n      <ab-dropdown model="carYear"\n                   options="carYearDropdown"\n                   depend-on="{brand: carBrand, model: carModel}"\n                   watch-on="carModel"\n                   api-handler="getDropdownItem()">\n      </ab-dropdown>\n    </div>\n    <div class="col-lg-6">\n      <ab-dropdown model="trimData"\n                   options="carTrimDropdown"\n                   watch-on="carYear"\n                   depend-on="{brand: carBrand, model:carModel, year: carYear}"\n                   api-handler="getDropdownItem()">\n      </ab-dropdown>\n    </div>\n  </div>\n  <div class="error-message" ng-show="showErrorMsg">\n    <i class="m-cgg-icon--warning"></i> Please answer the questions so we can give you an accurate quote\n  </div>\n\n  <div class="result-container row">\n    <div class="col-lg-12">\n      <div class="result-title">\n        <strong>The cheapest deal for your car starts at :</strong>\n      </div>\n      <div class="result-item row">\n        <div class="col-xs-5 col-lg-6 result-label text-right">\n          <div class="result-label-price">Yearly price:</div>\n          <div class="result-label-deductible">Deductible:</div>\n        </div>\n        <div class="col-xs-7 col-lg-6 result-placeholder" ng-hide="result">\n            To get price, answer the above questions\n        </div>\n        <div class="col-xs-7 col-lg-6 result-numbers" ng-show="result">\n          <div class="text-left" ng-show="result">\n            <div class="result-price">\n              {{result.price.original | currency : \'\' : 0}} PHP\n            </div>\n            <div class="result-deductible">\n              {{result.price.deductible | currency : \'\' : 0}} PHP\n            </div>\n          </div>\n        </div>\n\n        <img class="result-arrow" src="http://assets.ciab.compareglobal.co.uk/philippines/moneymax.ph/preview/ph/images/general/ab-orange-arrow.svg" ng-hide="result">\n      </div>\n    </div>\n    <div class="col-lg-12">\n      <ab-button class="btn-trackable"\n                 options="getFunnelBtnOptions"\n                 ng-show="result"\n                 ng-click="goToFunnel()"\n                 ga-category="car-insurance"\n                 ga-action="Landing Page Buttons"\n                 ga-label="Show results">\n        <div class="car-selector-button__main-text">See this deal and all other results</div>\n        <div class="car-selector-button__secondary-text">Get instant replies, free and non-binding</div>\n      </ab-button>\n      <div class="result-footnote">\n        *Prices might change once all considerations have been filled in.\n      </div>\n    </div>\n  </div>\n</div>\n');}]);
app
  .directive("abSpinner", function() {
    return {
      restrict: "AE",
      replace: true,
      templateUrl: "spinner/spinner.html",
      scope: {
        options: "=?"
      },
      controller: "abSpinner"
    };
  })
  .controller("abSpinner", [
    "$scope",
    function($scope) {
      $scope.options = $scope.options || {};
      $scope.options.size = $scope.options.size || "medium";
      $scope.options.color = "grey";
    }
  ]);

app.directive("abButton", function() {
  return {
    replace: true,
    transclude: true,
    scope: {
      options: "=?"
    },
    templateUrl: "button/button.html",
    link: function(scope, elem, attr) {
      scope.options = scope.options || {};
    }
  };
});

app
  .directive("abWidget", function() {
    return {
      templateUrl: "widget/widget.html",
      controller: "abTestController"
    };
  })
  .controller("abTestController", ["$scope", "abTestService", "abHelper", function($scope, abTestService, abHelper) {
    $scope.carBrandDropdown = {
      key: "brand",
      placeholder: "Brand"
    };

    $scope.carModelDropdown = {
      key: "model",
      placeholder: "Model"
    };

    $scope.carYearDropdown = {
      key: "year",
      placeholder: "Year"
    };

    $scope.carTrimDropdown = {
      key: "trims",
      placeholder: "Trim",
      modelKey: "trim"
    };

    $scope.getDropdownItem = function() {
      return function(queryObj) {
        var url = host + "/api/car-insurance/v2/cars";
        return abTestService.request(url, queryObj);
      };
    };

    $scope.getResultBtnOptions = {};

    $scope.getFunnelBtnOptions = {};

    $scope.validation = function() {
      var brand = $scope.carBrand;
      var model = $scope.carModel;
      var year = $scope.carYear;
      var trim =
        typeof $scope.trimData === "object" ? $scope.trimData.trim : undefined;

      if (brand && model && year && trim) {
        $scope.showErrorMsg = false;
        $scope.carBrandDropdown.showError = false;
        $scope.carModelDropdown.showError = false;
        $scope.carYearDropdown.showError = false;
        $scope.carTrimDropdown.showError = false;
        return true;
      } else {
        $scope.showErrorMsg = true;
        if (!brand) {
          $scope.carBrandDropdown.showError = true;
        }

        if (!model) {
          $scope.carModelDropdown.showError = true;
        }

        if (!year) {
          $scope.carYearDropdown.showError = true;
        }

        if (!trim) {
          $scope.carTrimDropdown.showError = true;
        }
        return false;
      }
    };

    $scope.$watch("trimData", function(val) {
      // remove result when trim is changed, users will need to click get quote button again after filling all the fields
      $scope.result = null;

      if (val) {
        $scope.showErrorMsg = false;

        if (typeof dataLayer !== "undefined") {
          dataLayer.push({
              "event": "simpleEvent",
              "eventDetails" : {
                  "category" : "car-insurance",
                  "action": "Clicked Landing Page Buttons",
                  "label": "Find the best insurance for my car",
                  "location": "Landing Page"
              }
          });
        }

        $scope.resultHandler()
      }
    });

    $scope.resultHandler = function() {
      if (!$scope.validation()) {
        return;
      }

      $scope.getResultBtnOptions.showSpinner = true;

      var carTrim = $scope.trimData.trim;
      var vehicleType = $scope.trimData.vehicleType;
      if (vehicleType === "SQ") {
        var queryObj = {
          carBrand: $scope.carBrand,
          carModel: $scope.carModel,
          carVintage: $scope.carYear,
          carTrim: carTrim
        };
        // go to funnel
        location.href =
          host +
          "/car-insurance/car-information#/step/1?" +
          abHelper.objectToQuery(queryObj);
        return;
      }

      var fmvUrl = host + "/api/car-insurance/v2/cars";

      var getFMV = function() {
        return abTestService
          .request(fmvUrl, {
            brand: $scope.carBrand,
            model: $scope.carModel,
            year: $scope.carYear,
            trim: carTrim
          })
          .then(function(data) {
            $scope.carFMV = data.fmv.filter(function(item) {
              return item.indexOf("Default FMV") !== -1;
            })[0];
            return $scope.carFMV;
          });
      };

      var resultUrl = host + "/api/car-insurance/v3/plans/default";

      var getResult = function() {
        $scope.payload = {
          carBrand: $scope.carBrand,
          carModel: $scope.carModel,
          carVintage: $scope.carYear,
          carTrim: carTrim,
          carFMV: $scope.carFMV,
          vehicleType: vehicleType,
          hasMortgage: false,
          hasCarInsurance: false,
          hasActsOfNature: false,
          primaryUse: "private",
          bodily_injured: 200000,
          personal_accident: 250000
        };

        return abTestService
          .request(resultUrl, $scope.payload)
          .then(function(data) {
            $scope.result = data.products.sort(function(a, b) {
              return a.price.original - b.price.original;
            })[0]; // general product with lowest price;
            $scope.getResultBtnOptions.showSpinner = false;

            var $scrollTopElem = abHelper.isMobile()
              ? $(".result-container")
              : $(".carinsurance-landing");

            // need timeout here to wait for rendering
            setTimeout(function() {
              $("html, body").animate(
                {
                  scrollTop: $scrollTopElem.offset().top
                },
                1000
              );
            }, 0);
          });
      };

      getFMV().then(getResult);
    };

    $scope.goToFunnel = function() {
      $scope.getFunnelBtnOptions.showSpinner = true;
      location.href =
        host +
        "/car-insurance/car-information#/step/1?" +
        abHelper.objectToQuery($scope.payload);
    };
  }]);

// bootstrap need to be declared in app.js
angular.element(document).ready(bootstrap());
