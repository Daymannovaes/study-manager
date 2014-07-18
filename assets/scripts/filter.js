SPapp.filter('with', function() {
  return function(items, field) {
        var result = {};
        angular.forEach(items, function(value, key) {
            if (!value.hasOwnProperty(field)) {
                result[key] = value;
            }
        });
        return result;
    };
});