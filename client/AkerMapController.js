require('./geoLocationService');
require('./akermap').controller('AkerMapController', function($scope, geoLocation) {
    'use strict';

    $scope.categories = [
        'bees',
        'beekeeping_equipment',
        'chickens',
        'plants',
        'seeds',
        'soil',
        'worms',
        'other'
    ];

    $scope.selectedCategories = angular.copy($scope.categories);

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


    $scope.mapOptions = {
        styles: require('./map/styles/avocado.json')
    };

    $scope.layerOptions = {
        query: {
            from: '1tteiG-HYAlsmh3ef5U-XVDEWu5QXqDxqWwDx-pc',
            //from: "1d8ppDMgF_ruJB1X8JMtHBkrA0Kt9xdnzjQ4zGiDp",
            select: "Location",
            //where: "'Produce' IN ('bees','beekeeping_equipment','chickens','plants','seeds','worms','other')"
        }
    };
});
