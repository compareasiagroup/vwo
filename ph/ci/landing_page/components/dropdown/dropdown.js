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
  .controller("abDropdownController", function($scope) {});
