app.directive("abButton", function() {
  return {
    transclude: true,
    scope: {
      options: "=?"
    },
    templateUrl: "button/button.html",
    link: function(scope, elem, attr) {}
  };
});
