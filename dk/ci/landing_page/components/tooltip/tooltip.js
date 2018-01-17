app.directive("abTooltip", [function() {
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
      }
    }
  };
}]);
