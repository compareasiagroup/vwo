app.factory("abTestService", function($http) {
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
});
