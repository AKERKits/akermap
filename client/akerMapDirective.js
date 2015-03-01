require('./geoLocationService');
require('./mapDataService');
var styles = require('./map/styles/avocado.json');

require('./akermap').directive('akerMap', function(geoLocationService, mapData, $log) {
    'use strict';

    return {
        restrict: 'E',
        require: '^main',
        templateUrl: require('./templates/akerMapDirective.html'),
        link: function($scope) {

            $scope.map = {
                refresh: false,
              bounds: {}
            };

            $scope.markers = [];

            function updateMarkers() {
                mapData.get().then(function(list) {
                    $scope.markers = list;
                });
            }
            updateMarkers();

            $scope.$on('updateFilters', function() {
                $log.debug('updating markers and refreshing map');
                updateMarkers();
                $scope.map.refresh = true;
            });


            // test data
            // $scope.markers = require('./data/bogus.json');

            geoLocationService()
                .then(
                    function success(geoLocatedCoords) {
                        return {
                          center: geoLocatedCoords,
                          zoom: 12
                        };
                    },
                    function useFallback() {
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
                    angular.extend($scope.map, map);
                });

            $scope.mapOptions = {
                scrollwheel: false,
                styles: styles
            };
        }
    };

});
