app.factory("abHelper", function() {
  var abHelper = {};
  abHelper.queryToObject = function(queryString) {};

  abHelper.objectToQuery = function(queryObj) {
    return Object.keys(queryObj).reduce(function(prev, key) {
      return prev + "&" + key + "=" + queryObj[key];
    }, "");
  };

  abHelper.isMobile = function() {
    return window.innerWidth < 768;
  };

  return abHelper;
});
