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
