require('./geoLocationService');
require('./mapDataService');
require('./formModal');
require('./fabLabDataService');
require('./templates/akerMapDirective.html');
require('./templates/markerInfoWindow.html');
require('./templates/addResourceBox.html');
require('./templates/fabLabInfoWindow.html');

var styles = require('./map/styles/avocado.json');
var categories = require('./categories');
var _ = require('lodash');

require('./akermap').directive('akerMap',
['uiGmapGoogleMapApi', 'geoLocationService', 'mapData', '$log', '$q', 'formModal', '$sanitize', 'fabLabDataService',
function(uiGmapGoogleMapApi, geoLocationService, mapData, $log, $q, formModal, $sanitize, fabLabDataService) {
    'use strict';

    return {
        restrict: 'E',
        require: '^main',
        templateUrl: require('./templates/akerMapDirective.html'),
        link: function($scope) {
            $scope.fabLabMarkers = null;

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
                          zoom: 3
                        };
                    },
                    function useFallback() {
                        return {
                          center: {
                              // Denver
                            latitude: 39.7643389,
                            longitude: -104.8551114
                          },
                          zoom: 3
                        };
                    }
                );
            }

            $scope.addResourceMarkerClick = function() {
                formModal.data = {
                    latitude: $scope.map.addResourceMarker.latitude,
                    longitude: $scope.map.addResourceMarker.longitude
                };
                hideAddResourceMarker();
                formModal.activate();
            };

            $scope.addResourceBox = {
                options: {},
                template: require('./templates/addResourceBox.html'),
                events: {
                    'places_changed': function(searchBox) {
                        var places = searchBox.getPlaces();

                        if (places.length === 0) {
                          return;
                        }
                        var place = places[0];

                        var map = $scope.map.control.getGMap();
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);
                        } else {
                            map.setCenter(place.geometry.location);
                            map.setZoom(16);
                        }
                        var latLng = place.geometry.location;
                        showAddResourceMarker(latLng.lat(), latLng.lng());
                    }
                },
                position: 'TOP_CENTER'
            };


            function showAddResourceMarker(latitude, longitude) {
                hideMarkerInfoWindow();
                hideFabLabInfoWindow();

                if ($scope.map.addResourceMarker.latitude && $scope.map.addResourceMarker.longitude) {
                    hideAddResourceMarker();
                    $scope.$apply();
                }

                angular.extend($scope.map.addResourceMarker, {
                    latitude: latitude,
                    longitude: longitude
                });

                //scope apply required because this event handler is outside of the angular domain
                $scope.$apply();
            }

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
                    click: function (map, eventName, originalEventArgs) {
                        // 'this' is the directive's scope
                        var e = originalEventArgs[0];
                        showAddResourceMarker(e.latLng.lat(), e.latLng.lng());
                    },
                    'bounds_changed': function(map) {
                        var bounds = map.getBounds();
                        $log.debug('biasing add resource box towards map bounds');
                        $scope.addResourceBox.options.bounds = bounds;
                    }
                },
                control: {}
            };
            $scope.mapOptions = {};
            $scope.markers = [];

            function hideMarkerInfoWindow() {
                $scope.markerInfoWindow.show = false;
            }

            function hideFabLabInfoWindow() {
                $scope.fabLabInfoWindow.show = false;
            }

            function reInitInfoWindowDisplay() {
                // make sure the template content is updated by destroying the window first
                hideMarkerInfoWindow();
                hideFabLabInfoWindow();

                hideAddResourceMarker(); // if the add resource marker was open, hide that as well
                $scope.$apply();
            }

            $scope.markerEvents = {
                click: function (model, eventName, marker) {
                    reInitInfoWindowDisplay();

                    // new coordinates and contents
                    $scope.markerInfoWindow.coords.longitude = marker.longitude;
                    $scope.markerInfoWindow.coords.latitude = marker.latitude;
                    $scope.markerInfoWindow.templateParameter = {
                        name: marker.name,
                        categories: _.filter(marker.categories, function(item) {
                            return _.has(categories, item);
                        }),
                        sustainability: +marker.sustainability,
                        address: marker.address,
                        phone: marker.phone,
                        email: $sanitize(marker.email),
                        url: $sanitize(marker.url),
                        description: marker.description,
                        contributor: marker.contributor
                    };
                    $scope.markerInfoWindow.show = true;

                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            };

            $scope.fabLabMarkerEvents = {
                click: function(model, eventName, marker) {
                    reInitInfoWindowDisplay();

                    // new coordinates and contents
                    $scope.fabLabInfoWindow.coords.longitude = marker.longitude;
                    $scope.fabLabInfoWindow.coords.latitude = marker.latitude;

                    var url = marker.website;
                    if (url.substr(0, 'http://'.length) !== 'http://') {
                        url = 'http://' + url;
                    }

                    $scope.fabLabInfoWindow.templateParameter = {
                        workshop: marker.fablabname,
                        kit: marker.akerkit,
                        software: marker.camsoftware,
                        router: marker.cncrouter,
                        email: $sanitize(marker.email),
                        phone: marker.phone,
                        url: $sanitize(url),
                        contact: marker.workshopcontactperson,
                        address: marker.streetaddresscitystatezip,
                        capacity: +marker.localattendeecapacity
                    };
                    $scope.fabLabInfoWindow.show = true;

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
                    hideMarkerInfoWindow();

                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            };

            $scope.fabLabInfoWindow = {
                coords: {
                    longitude: null,
                    latitude: null
                },
                show: false,
                templateUrl: require('./templates/fabLabInfoWindow.html'),
                options: {},
                templateParameter: {},
                closeClick: function() {
                    $log.debug('close fablab window');
                    hideFabLabInfoWindow();

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
                hideMarkerInfoWindow();
                hideFabLabInfoWindow();
                updateMarkers().then(function() {
                    $scope.map.refresh = true;
                });
            });

            $q.all({
                map: locate(),
                markers: updateMarkers(),
                maps: uiGmapGoogleMapApi,
                fabLabMarkers: fabLabDataService.get()
            }).then(function(data) {
                var map = data.map;
                var maps = data.maps;

                $scope.fabLabMarkers = data.fabLabMarkers;

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
                        url: require('./images/pins/add.svg'),
                        size: new maps.Size(100, 100),
                        scaledSize: new maps.Size(36, 36),
                        anchor: new maps.Point(18, 36)
                };
                $scope.map.addResourceMarker.options.animation = maps.Animation.DROP;

                var offset = new maps.Size(0, -36);
                $scope.markerInfoWindow.options.pixelOffset = offset;
                $scope.fabLabInfoWindow.options.pixelOffset = offset;

                angular.extend($scope.map, map);
            });
        }
    };

}]);
