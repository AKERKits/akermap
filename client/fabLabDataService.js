var SPREADSHEET_KEY = '1_sumKmD2ANX6TLV_8ljI9H3suzyQt38RjWaGMcJjvGA';
var SPREADSHEET_URL = 'https://spreadsheets.google.com/feeds/list/' + SPREADSHEET_KEY + '/default/public/values?alt=json-in-script&callback=JSON_CALLBACK';

require('./akermap')
    .factory('fabLabDataService',
    ['$http', 'uiGmapGoogleMapApi', '$q', '$log',
    function($http, uiGmapGoogleMapApi, $q, $log) {
        'use strict';

        // initially from: https://gist.github.com/liddiard/11502dd08f3a4b7727a0
        function prettifySpreadsheetJSON(data) {
            var prefix = 'gsx$';
            for (var i = 0; i < data.feed.entry.length; i++) {
                for (var key in data.feed.entry[i]) {
                    if (data.feed.entry[i].hasOwnProperty(key) && key.substr(0, prefix.length) === prefix) {
                        data.feed.entry[i][key.substr(prefix.length)] = data.feed.entry[i][key].$t;
                        delete data.feed.entry[i][key];
                    }
                }
            }
        }

        function geocodeFabLabMarkers(markers) {

            return uiGmapGoogleMapApi.then(function(maps) {

                var geocoder = new maps.Geocoder();
            var icon = {
                url: require('./images/pins/fablab.svg'),
                size: new maps.Size(100, 100),
                scaledSize: new maps.Size(36, 36),
                anchor: new maps.Point(18, 36)
            };

            var promises = markers.map(function(marker) {
                var deferred = $q.defer();
                geocoder.geocode({
                    'address': marker.streetaddresscitystatezip
                }, function(results, status) {
                    if (status === maps.GeocoderStatus.OK) {
                        var location = results[0].geometry.location;
                        marker.latitude = location.lat();
                        marker.longitude = location.lng();
                        marker.icon = icon;
                        deferred.resolve(marker);
                    } else {
                        $log.warn('geocoding', marker.streetaddresscitystatezip, 'failed', status);
                        deferred.resolve(null);
                    }
                });
                return deferred.promise;
            });
            return $q.all(promises).then(function(markers) {
                return markers.filter(function(marker) {
                    return marker !== null;
                });
            });
        });
        }


        return {
            get: function() {
                return $http.jsonp(SPREADSHEET_URL, {cache : false})
                .then(function(response) {
                    prettifySpreadsheetJSON(response.data);
                    return response.data.feed.entry;
                }).then(function(markers) {
                    return markers.map(function clean(marker) {
                        delete marker.link;
                        delete marker.updated;
                        delete marker.category;
                        delete marker.timestamp;
                        delete marker.content;
                        delete marker.title;
                        marker.id = marker.id.$t;
                        return marker;
                    });
                }).then(function(markers) {
                    return geocodeFabLabMarkers(markers);
                });
            }
        };
    }]);
