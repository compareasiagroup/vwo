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
