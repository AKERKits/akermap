require('./geoLocationService');
require('./mapDataService');
var styles = require('./map/styles/avocado.json');

require('./akermap').directive('akerMap', function(uiGmapGoogleMapApi, geoLocationService, mapData, $log, $q) {
    'use strict';

    return {
        restrict: 'E',
        require: '^main',
        templateUrl: require('./templates/akerMapDirective.html'),
        link: function($scope, element, attrs, mainCtrl) {

            $scope.clickedMarkerClick = function() {
                $scope.map.clickedMarker.latitude = $scope.map.clickedMarker.longitude = null;
                mainCtrl.toggleShowAddResourceForm(true);
            };

            $scope.map = {
                refresh: false,
                bounds: {},
                clickedMarker: {
                    id: 0,
                    options:{
                    }
                },
                events: {
                    click: function (mapModel, eventName, originalEventArgs) {
                              // 'this' is the directive's scope
                              $log.info("user defined event: " + eventName, mapModel, originalEventArgs);

                              var e = originalEventArgs[0];
                              var lat = e.latLng.lat(),
                                lon = e.latLng.lng();
                              $scope.map.clickedMarker = {
                                id: 0,
                                options: {
                                  labelContent: 'Click to add your resource here: ' + 'lat: ' + lat + ' lon: ' + lon,
                                  //labelClass: "marker-labels",
                                  labelAnchor:"50 0"
                                },
                                latitude: lat,
                                longitude: lon
                              };
                              //scope apply required because this event handler is outside of the angular domain
                              $scope.$apply();
                            }
                }
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
