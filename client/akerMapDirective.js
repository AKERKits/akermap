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

            function hideAddResourceMarker() {
                $scope.map.addResourceMarker.latitude = $scope.map.addResourceMarker.longitude = null;
            }

            $scope.addResourceMarkerInfoWindowCloseClick = function() {
                hideAddResourceMarker();
                $scope.$apply();
            };

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

            $scope.addResourceMarkerClick = function() {
                hideAddResourceMarker();
                mainCtrl.toggleShowAddResourceForm(true);
            };

            $scope.map = {
                refresh: false,
                bounds: {},
                addResourceMarker: {
                    id: 0,
                    options: {
                        draggable: true
                    }
                },
                events: {
                    click: function (mapModel, eventName, originalEventArgs) {
                        // 'this' is the directive's scope

                        function show() {
                            var e = originalEventArgs[0];
                            angular.extend($scope.map.addResourceMarker, {
                                latitude: e.latLng.lat(),
                                longitude: e.latLng.lng()
                            });

                            //scope apply required because this event handler is outside of the angular domain
                            $scope.$apply();
                        }

                        if ($scope.map.addResourceMarker.latitude && $scope.map.addResourceMarker.longitude) {
                            hideAddResourceMarker();
                            $scope.$apply();
                        }
                        show();

                    }
                }
            };
            $scope.mapOptions = {};
            $scope.markers = [];

            $scope.markerEvents = {
                click: function (_, eventName, marker) {
                    //$log.debug(marker);

                    // make sure the template content is updated by destroying the window first
                    $scope.markerInfoWindow.show = false;
                    $scope.$apply();

                    // new coordinates and contents
                    $scope.markerInfoWindow.coords.longitude = marker.longitude;
                    $scope.markerInfoWindow.coords.latitude = marker.latitude;
                    $scope.markerInfoWindow.templateParameter = marker;
                    $scope.markerInfoWindow.show = true;

                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            };

            $scope.markerInfoWindow = {
                coords: {
                    longitude: null,
                    latitude: null
                },
                show: false,
                templateUrl: require('./templates/markerInfoWindow.html'),
                options: {},
                templateParameter: {},
                closeClick: function() {
                    $log.debug('close window');
                    $scope.markerInfoWindow.show = false;

                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            };

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

                $scope.map.addResourceMarker.icon = {
                        url: 'images/icons/add.svg',
                        size: new maps.Size(100, 100),
                        scaledSize: new maps.Size(36, 36),
                        anchor: new maps.Point(18, 36)
                };
                $scope.map.addResourceMarker.options.animation = maps.Animation.DROP;

                $scope.markerInfoWindow.options.pixelOffset = new maps.Size(0, -36);

                angular.extend($scope.map, map);
            });
        }
    };

});
