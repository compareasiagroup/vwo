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
