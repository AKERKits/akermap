require('./geoLocationService');

var mapStyles = require('./map/styles/avocado.json');

require('./akermap').controller('AkerMapController', function($scope, geoLocation) {
    'use strict';

	geoLocation()
    .then(
        function geoLocationSucceeded(geoLocatedCoords) {
            return {
              center: geoLocatedCoords,
              zoom: 12
            };
        },
        function geoLocationFailedUseFallback() {
            return {
              center: {
                  // Denver
                latitude: 39.7643389,
                longitude: -104.8551114
              },
              zoom: 9
            };
        }
    )
    .then(function(map) {
        $scope.map = map;
    });


    $scope.options = {
        styles: mapStyles
    };
});
