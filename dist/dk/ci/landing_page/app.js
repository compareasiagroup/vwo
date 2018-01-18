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
$(".hero-carousel_item")
  .css("background-image", "url(" + bgImageUrl + ")")
  .css("position", "relative");

var $container = $(".hero-carousel__item__row");

$container.html("<ab-widget></ab-widget>");

// in local, we can't get the API work
var host = isLocal ? "http://denmark-qa.compareglobal.co.uk" : location.origin;

// ------ HERE BEGINS THE ANGULAR APP --------
var app = angular.module("abTestApp", []);
var bootstrap = function() {
  angular.bootstrap($(document), ["abTestApp"]);
};

app.factory("abTestService", ["$http", function($http) {
  var service = {};

  service.request = function(req) {
    return $http(req).then(function(response) {
      return response.data;
    });
  };

  service.checkPlateNumber = function(plateNumber) {
    var reqObj = {
      url: "https://ci-backend-eu.compareglobal.co.uk/api/v1/denmark/plate",

      params: {
        search: plateNumber
      },

      headers: {
        authorization: "Bearer cs3KIma6yt16HvjgiUzv92ZzRHpzSmXJXkeQY4wImYk"
      }
    };

    return service.request(reqObj);
  };

  return service;
}]);

app.directive("abCarPlate", [
  "abTestService",
  function(abTestService) {
    return {
      replace: true,
      scope: {
        options: "=?",
        model: "="
      },
      templateUrl: "car-plate/car-plate.html",
      link: function(scope) {
        scope.spinnerOptions = { color: "grey" };
      }
    };
  }
]);

app.directive("abDropdown", [
  function() {
    return {
      replace: true,
      scope: {
        options: "=?",
        model: "="
      },
      templateUrl: "dropdown/dropdown.html",
      link: function(scope) {
        scope.$watch("model", function(val) {
          if (val) {
            scope.options.showError = false;
          }
        });
      }
    };
  }
]);

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

app.directive("abTooltip", [
  function() {
    return {
      replace: true,
      transclude: true,
      scope: {
        options: "=?"
      },
      templateUrl: "tooltip/tooltip.html",
      link: function(scope) {
        scope.showTooltip = false;

        scope.show = function() {
          scope.showTooltip = true;
        };

        scope.hide = function() {
          scope.showTooltip = false;
        };
      }
    };
  }
]);

app
  .directive("abWidget", function() {
    return {
      templateUrl: "widget/widget.html",
      controller: "abTestController"
    };
  })
  .controller("abTestController", [
    "$scope",
    "abTestService",
    function($scope, abTestService) {
      $scope.plateNumberOptions = {
        label: "Enter your car's licence number",
        tooltip: "Ved at indtaste din nummerplade kan vi nemt finde din bil",
        placeholder: "e.g. AB12345",
        pattern: "^[a-zA-Z0-9]{2,7}$",
        error: "Vi kan desværre ikke genkende din nummerplade"
      };

      $scope.vehicleTypeOptions = {
        label: "Plate type",
        tooltip: "Vælg typen af nummerplade din bil har",
        placeholder: "Vælg type nummerplade",
        selectablePlaceholder: true,
        error: "Indtast venligst gyldig nummerplade",
        items: [
          { value: "white", text: "Hvide plader" },
          { value: "yellow", text: "Gule plader" },
          { value: "parrot", text: "Papegøjeplader" }
        ]
      };

      var validate = function(val, pattern) {
        if (!pattern) return true;
        var regExp = new RegExp(pattern);
        return regExp.test(val);
      };

      $scope.$watch("plateNumber", function(val, old) {
        // if (val && val.length === 7) {
        //   abTestService.checkPlateNumber(val).then(function(data) {
        //     var isValidPlateNumber = !!data.length;
        //     $scope.vehicleTypeOptions.disabled = isValidPlateNumber;
        //     $scope.plateNumberOptions.isValid = isValidPlateNumber;
        //   })
        // } else {
        //   $scope.plateNumberOptions.isValid = false;
        // }

        var options = $scope.plateNumberOptions;

        if (val === old && !val) return;

        options.showSuccessIcon = false;
        options.showSpinner = false;

        var isValidByPattern = validate(val, options.pattern);

        if (isValidByPattern) {
          options.showError = false;
          options.showSpinner = true;

          abTestService
            .checkPlateNumber(val)
            .then(function(data) {
              var isValidByApi = data && !!data.length;
              options.isValid = isValidByApi;
              options.showError = !isValidByApi;
              options.showSuccessIcon = isValidByApi;

              if (isValidByApi) {
                $scope.vehicleTypeOptions.disabled = true;
                $scope.vehicleTypeOptions.showError = false;
              }
            })
            .catch(function(e) {
              console.warn(e);
            })
            .then(function() {
              options.showSpinner = false;
            });
        } else {
          options.isValid = false;
          options.showError = true;
        }
      });

      $scope.$watch("vehicleType", function(val) {
        if (val) {
          $scope.plateNumberOptions.showError = false;
        }

        // $scope.plateNumberOptions.disabled = !!val;
        $scope.vehicleTypeOptions.isValid = !!val;
      });

      $scope.click = function() {
        var isValidVehicle = $scope.vehicleTypeOptions.isValid;
        var isValidPlate = $scope.plateNumberOptions.isValid;

        var url = location.origin + "/bilforsikring/indhentpriser#/step/1";

        if (isValidPlate) {
          console.log("goto funnel with plate number", $scope.plateNumber);
          location.href = url + "?licensePlateNum=" + $scope.plateNumber;
        } else if (isValidVehicle) {
          console.log("goto funnel with car type", $scope.vehicleType);
          location.href = url + "?licensePlateType=" + $scope.vehicleType;
        } else {
          $scope.vehicleTypeOptions.showError = true;
          $scope.plateNumberOptions.showError = true;
        }
      };
    }
  ]);

angular.module('abTestApp').run(['$templateCache', function($templateCache) {$templateCache.put('car-plate/car-plate.html','<div class="ab-plate" ng-class="{\'disabled\':options.disabled}">\n  <div class="ab-panel-label">\n    {{options.label}}\n    <ab-tooltip ng-if="options.tooltip">{{options.tooltip}}</ab-tooltip>\n  </div>\n  <div class="ab-plate-container" ng-class="{\'error\': options.showError}">\n    <input class="ab-input ab-input-plate"\n           placeholder="{{options.placeholder}}"\n           ng-class="{\'error\': options.showError}"\n           ng-model="model"\n           ng-disabled="options.disabled"\n    >\n    <div class="ab-plate__spinner-container">\n      <ab-spinner options="spinnerOptions" ng-show="options.showSpinner"></ab-spinner>\n      <i class="success m-cgg m-cgg-icon--boxes-tick" ng-show="options.showSuccessIcon"></i>\n    </div>\n    <div class="error-message" ng-show="options.showError">\n      {{options.error}}\n    </div>\n  </div>\n</div>');
$templateCache.put('dropdown/dropdown.html','<div class="ab-select-container" ng-class="{\'disabled\':options.disabled, \'error\':options.showError}">\n  <div class="ab-panel-label">\n    {{options.label}}\n    <ab-tooltip ng-if="options.tooltip">{{options.tooltip}}</ab-tooltip>\n  </div>\n  <select class="ab-select" ng-model="model" ng-disabled="options.disabled">\n    <option value="" ng-disbled="!options.selectablePlaceholder" selected ng-if="options.placeholder">\n      {{options.placeholder}}\n    </option>\n    <option ng-repeat="item in options.items" ng-value="item.value">{{item.text || item.value}}</option>\n  </select>\n  <div class="error-message" ng-show="options.showError">\n    {{options.error}}\n  </div>\n</div>');
$templateCache.put('spinner/spinner.html','<span class="cgg-spinner" ng-class="{\'cgg-spinner__{{options.color}}\': options.color}">\n    <span class="sk-placeholder" ng-show="options.placeholder" ng-class="{\'sk-placeholder__{{options.size}}\': options.size}" style="float: {{options.placeholder.position ? options.placeholder.position : \'left\'}}">{{options.placeholder}}</span>\n    <div class="sk-circle" ng-class="{\'sk-circle__{{options.size}}\': options.size}">\n        <div class="sk-circle1 sk-child"></div>\n        <div class="sk-circle2 sk-child"></div>\n        <div class="sk-circle3 sk-child"></div>\n        <div class="sk-circle4 sk-child"></div>\n        <div class="sk-circle5 sk-child"></div>\n        <div class="sk-circle6 sk-child"></div>\n        <div class="sk-circle7 sk-child"></div>\n        <div class="sk-circle8 sk-child"></div>\n        <div class="sk-circle9 sk-child"></div>\n        <div class="sk-circle10 sk-child"></div>\n        <div class="sk-circle11 sk-child"></div>\n        <div class="sk-circle12 sk-child"></div>\n    </div>\n</span>');
$templateCache.put('tooltip/tooltip.html','<div class="ab-tooltip">\n  <div ng-show="showTooltip" class="ab-tooltip-box">\n    <ng-transclude></ng-transclude>\n  </div>\n  <i class="m-cgg m-cgg-icon--i-tooltip ab-tooltip-icon"\n     ng-mouseover="show()"\n     ng-mouseout="hide()"\n  ></i>\n\n</div>');
$templateCache.put('widget/widget.html','<div class="ab-container" id="ab-test-app">\n  <h3 class="ab-title">Tell us about your car, and we\u2019ll tell you the best\n    Car Insurance deals from all 20 providers in Denmark</h3>\n  <div class="ab-panel">\n    <div class="ab-panel-item ab-panel-plate">\n      <ab-car-plate model="plateNumber" options="plateNumberOptions"></ab-car-plate>\n    </div>\n\n    <div class="ab-separator-container">\n      <div class="ab-separator-text">OR</div>\n      <div class="ab-separator-line"></div>\n    </div>\n\n    <div class="ab-panel-item">\n      <ab-dropdown model="vehicleType" options="vehicleTypeOptions"></ab-dropdown>\n    </div>\n\n    <div class="ab-separator-container ab-separator-2">\n      <div class="ab-separator-line"></div>\n    </div>\n\n    <div class="ab-panel-item">\n      <a class="ab-cta-button" ng-click="click()">\n        Find Insurance\n      </a>\n    </div>\n  </div>\n\n  <div class="ab-trustpilot-container">\n    <div class="trustpilot-widget" data-locale="da-DK" data-template-id="5419b732fbfb950b10de65e5"\n         data-businessunit-id="5473401a00006400057bbac8" data-style-height="20px" data-style-width="100%"\n         data-theme="dark">\n      <a href="https://dk.trustpilot.com/review/samlino.dk" target="_blank">Trustpilot</a>\n    </div>\n  </div>\n  <div class="ab-footer">\n    As seen on:\n  </div>\n</div>\n');}]);
// bootstrap need to be declared in app.js
angular.element(document).ready(bootstrap());
