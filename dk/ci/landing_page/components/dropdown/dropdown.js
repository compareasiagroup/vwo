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
