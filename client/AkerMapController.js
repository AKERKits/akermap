var mapStyles = require('./map/styles/avocado.json');

require('./akermap').controller('AkerMapController', function($scope, geoLocation) {
	geoLocation().then(function(geoLocatedCoords) {
		return {
      center: geoLocatedCoords,
      zoom: 12
    };
	}, function geoLocationFailedUseFallback() {
    return {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 9
    };
  }).then(function(map) {
    $scope.map = map;
  });


	$scope.options = {
		styles: mapStyles
	};
});
