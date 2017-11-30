app.factory("abTestService", function($http, abHelper) {
  var service = {};
  service.request = function(url, queryObj) {
    queryObj = queryObj || {};
    var queryString = abHelper.objectToQuery(queryObj);
    return $http.get(url + "?" + queryString).then(function(response) {
      return response.data;
    });
  };

  return service;
});
