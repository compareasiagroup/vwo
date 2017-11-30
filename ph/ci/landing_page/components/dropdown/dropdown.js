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

        if (attrs.dependOn) {
          scope.$watch("dependOn", function(val) {
            scope.item = [];
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
  .controller("abDropdownController", function($scope) {});
