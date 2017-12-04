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
  .directive("abDropdown", function() {
    return {
      replace: true,
      scope: {
        model: "=?",
        options: "=?",
        items: "=?",
        dependOn: "=?",
        apiHandler: "&?"
      },
      controller: "abDropdownController",
      templateUrl: "dropdown/dropdown.html",
      link: function(scope, element, attrs) {
        scope.items = [];
        var handler = attrs.apiHandler ? scope.apiHandler() : null;

        scope.$watch("model", function(val, old) {
          if (!old && val) {
            scope.options.showError = false;
          }
        });

        if (attrs.dependOn) {
          scope.$watch("dependOn", function(val) {
            scope.items = [];
            scope.model = "";
            var isValid =
              val &&
              Object.keys(val).every(function(key) {
                return val[key];
              });

            if (isValid && handler) {
              handler(val).then(function(data) {
                scope.items = data[scope.options.key];
              });
            }
          });
        } else if (handler) {
          handler().then(function(data) {
            scope.items = data[scope.options.key];
          });
        }
      }
    };
  })
  .controller("abDropdownController", ["$scope", function($scope) {}]);

angular.module('abTestApp').run(['$templateCache', function($templateCache) {$templateCache.put('button/button.html','<a class="car-selector-button"\n   ng-class="{\'disabled\': options.showSpinner}">\n  <div ng-transclude\n       ng-if="!options.showSpinner"></div>\n  <ab-spinner ng-if="options.showSpinner"></ab-spinner>\n</a>\n');
$templateCache.put('dropdown/dropdown.html','<select ng-model="model" class="car-selector-dropdown" ng-class="{\'error\': options.showError}"\n        ng-disabled="options.disabled || !items.length">\n  <option value="" disabled selected ng-if="options.placeholder">{{options.placeholder}}</option>\n  <option ng-repeat="item in items" ng-value="item">{{options.modelKey ? item[options.modelKey]:item}}</option>\n</select>\n');
$templateCache.put('widget/widget.html','<div class="car-selector-container" id="ab-test-app">\n  <div class="car-selector-title">\n    <h3>Get an Instant quote now</h3>\n    <p>Tell us your car model, we\u2019ll tell you the best deal:</p>\n  </div>\n\n  <div class="row">\n    <div class="col-lg-6">\n      <ab-dropdown model="carBrand" options="carBrandDropdown" api-handler="getDropdownItem()"></ab-dropdown>\n    </div>\n\n    <div class="col-lg-6">\n      <ab-dropdown model="carModel" options="carModelDropdown" depend-on="{brand: carBrand}"\n                   api-handler="getDropdownItem()"></ab-dropdown>\n    </div>\n  </div>\n\n  <div class="row margin-bottom">\n    <div class="col-lg-6">\n      <ab-dropdown model="carYear" options="carYearDropdown" depend-on="{brand: carBrand, model: carModel}"\n                   api-handler="getDropdownItem()"></ab-dropdown>\n    </div>\n    <div class="col-lg-6">\n      <ab-dropdown model="trimData" options="carTrimDropdown"\n                   depend-on="{brand: carBrand, model:carModel, year: carYear}"\n                   api-handler="getDropdownItem()"></ab-dropdown>\n    </div>\n  </div>\n  <div class="error-message" ng-show="showErrorMsg">\n    <i> icon </i> Please answer the questions so we can give you an accure quote\n  </div>\n  <ab-button options="getResultBtnOptions" ng-show="!result" ng-click="resultHandler()">\n    <div class="car-selector-button__main-text">Find the cheapest Car Insurance for my car</div>\n  </ab-button>\n\n  <div class="result-container row" ng-if="result">\n    <div class="col-lg-12">\n      <div class="result-title">\n        <strong>The cheapest deal for your car starts at :</strong>\n      </div>\n      <div class="result-item">\n\n        <div class="result-price">\n          {{result.price.original | currency : \'\' : 0}} PHP/year\n        </div>\n        <div class="result-deductible">\n          Deductible: {{result.price.deductible | currency : \'\' : 0}} PHP\n        </div>\n      </div>\n    </div>\n    <div class="col-lg-12">\n      <ab-button options="getFunnelBtnOptions"\n                 ng-show="result"\n                 ng-click="goToFunnel()"\n                 ga-category="car-insurance"\n                 ga-action="Front Page Buttons"\n                 ga-label="Find the best insurance for my car">\n        <div class="car-selector-button__main-text">See this deal and all other results</div>\n        <div class="car-selector-button__secondary-text">Get instant replies, free and non-binding</div>\n      </ab-button>\n      <div class="result-footnote">\n        *Prices might change once all considerations have been filled in.\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('spinner/spinner.html','<span class="cgg-spinner" ng-class="{\'cgg-spinner__{{options.color}}\': options.color}">\n    <span class="sk-placeholder" ng-show="options.placeholder" ng-class="{\'sk-placeholder__{{options.size}}\': options.size}" style="float: {{options.placeholder.position ? options.placeholder.position : \'left\'}}">{{options.placeholder}}</span>\n    <div class="sk-circle" ng-class="{\'sk-circle__{{options.size}}\': options.size}">\n        <div class="sk-circle1 sk-child"></div>\n        <div class="sk-circle2 sk-child"></div>\n        <div class="sk-circle3 sk-child"></div>\n        <div class="sk-circle4 sk-child"></div>\n        <div class="sk-circle5 sk-child"></div>\n        <div class="sk-circle6 sk-child"></div>\n        <div class="sk-circle7 sk-child"></div>\n        <div class="sk-circle8 sk-child"></div>\n        <div class="sk-circle9 sk-child"></div>\n        <div class="sk-circle10 sk-child"></div>\n        <div class="sk-circle11 sk-child"></div>\n        <div class="sk-circle12 sk-child"></div>\n    </div>\n</span>');}]);
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
      if (val) {
        $scope.showErrorMsg = false;
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
        // go to funnel
        location.href = "/";
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
      $scope.options.color = "medium";
    }
  ]);

// bootstrap need to be declared in app.js
angular.element(document).ready(bootstrap());
