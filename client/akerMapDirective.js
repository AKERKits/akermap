require('./geoLocationService');
require('./mapDataService');
var styles = require('./map/styles/avocado.json');

require('./akermap').directive('akerMap', function(uiGmapGoogleMapApi, geoLocationService, mapData, $log, $q) {
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
            $scope.mapOptions = {};
            $scope.markers = [];

            function updateMarkers() {
                return mapData.get().then(function(list) {
                    $scope.markers = list;
                });
            }

            $scope.$on('updateFilters', function() {
                $log.debug('updating markers and refreshing map');
                updateMarkers().then(function() {
                    $scope.map.refresh = true;
                });
            });

            // test data
            // $scope.markers = require('./data/bogus.json');
            function locate() {
                return geoLocationService().then(
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
                );
            }

            $q.all({
                map: locate(),
                markers: updateMarkers(),
                maps: uiGmapGoogleMapApi
            }).then(function(data) {
                var map = data.map;
                var maps = data.maps;

                angular.extend($scope.mapOptions, {
                    styles: styles,
                    disableDefaultUI: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: maps.ZoomControlStyle.LARGE,
                        position: maps.ControlPosition.TOP_RIGHT
                    },
                    streetViewControl: false
                });

                angular.extend($scope.map, map);
            });
        }
    };

});
