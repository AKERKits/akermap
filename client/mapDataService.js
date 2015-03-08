var Firebase = require('exports?Firebase!firebase');
var _ = require('lodash');
var categories = require('./data/categories.json');

require('./akermap')
    .factory('mapData', function(firebaseLocation, $firebaseArray, $q, $log, uiGmapGoogleMapApi) {
        'use strict';

        var ref = new Firebase(firebaseLocation);
        var locationsRef = ref.child('locations');
        var data = null;
        var current = null;

      function loadInitial() {
          if (data) {
              return data.promise;
          }
          data = $q.defer();

          /*
          locationsRef.push({
                  latitude: 39.7643389,
                  longitude: -104.8551114,
                  categories: ['bees', 'chickens']
          });
          */
          Firebase.goOnline();
          var sync = $firebaseArray(locationsRef);
          sync.$loaded().then(function(list) {
              Firebase.goOffline();
              data.resolve(list);
          });
          return data.promise;
      }

      function MapDataService() {
          this.categoryFilter = null;
      }

      MapDataService.prototype.get = function() {
          if (current) {
              return current.promise;
          }
          var self = this;
          current = $q.defer();
          var selectedCategories = self.getCategoryFilter();
          if (selectedCategories !== null && selectedCategories.length === 0) {
              // no categories selected, so result is empty
              current.resolve([]);
              return current.promise;
          }

          loadInitial()
            .then(angular.copy)
            .then(function applyCategoryFilter(list) {
                if (selectedCategories !== null) {
                  return list.filter(function(item) {
                      // if we have at least one matching category, it is part of the result
                      var intersectingCategories = _.intersection(item.categories, selectedCategories);
                      if (intersectingCategories.length === 0) {
                          return false;
                      }
                      $log.debug(item.categories, selectedCategories, 'intersecting:', intersectingCategories);
                      item.intersecting = intersectingCategories;
                      return true;
                  });
                }
                return list;
            })
            .then(function setIcons(list) {
                return uiGmapGoogleMapApi.then(function(maps) {
                    return list.map(function(item) {
                        var category = 'other';
                        if (item.intersecting && item.intersecting.length === 1) {
                            // we can define a specific icon
                            category = item.intersecting[0];
                        } else if(item.categories.length === 1) {
                            category = item.categories[0];
                        }

                        var iconData = categories[category].pin;
                        item.icon = {
                            url: iconData.url,
                            size: new maps.Size(iconData.size.w, iconData.size.h),
                            scaledSize: new maps.Size(iconData.scaled.w, iconData.scaled.h),
                            anchor: new maps.Point(iconData.anchor.x, iconData.anchor.y)
                        };
                        item.id = item.$id + '_' + category;
                        return item;
                    });
                });
            })
            .then(current.resolve);

          return current.promise;
      };

      MapDataService.prototype.setCategoryFilter = function(categories) {
          $log.debug('setting filter to',  categories);
          current = null;
          this.categoryFilter = categories;
      };

      MapDataService.prototype.getCategoryFilter = function() {
          return this.categoryFilter;
      };



      return new MapDataService();
    });
