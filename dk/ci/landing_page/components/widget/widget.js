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
