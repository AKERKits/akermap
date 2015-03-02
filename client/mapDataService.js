var Firebase = require('exports?Firebase!firebase');
var _ = require('lodash');
var categories = require('./data/categories.json');

/* global google */
require('./akermap')
    .factory('mapData', function(firebaseLocation, $firebase, $q, $log) {
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

          var sync = $firebase(locationsRef);
          sync.$asArray().$loaded().then(data.resolve);
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
          loadInitial()
            .then(function clone(list) {
                return angular.copy(list);
            })
            .then(function applyCategoryFilter(list) {
                var selectedCategories = self.getCategoryFilter();
                if (selectedCategories !== null && selectedCategories.length > 0) {
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
                return list.map(function(item) {
                    var category = 'other';
                    if (item.intersecting && item.intersecting.length === 1) {
                        // we can define a specific icon
                        category = item.intersecting[0];
                    } else if(item.categories.length === 1) {
                        category = item.categories[0];
                    }

                    var iconData = categories[category].icon;
                    item.icon = {
                        url: iconData.url,
                        size: new google.maps.Size(iconData.size.w, iconData.size.h),
                        scaledSize: new google.maps.Size(iconData.scaled.w, iconData.scaled.h),
                        anchor: new google.maps.Point(iconData.anchor.x, iconData.anchor.y)
                    };
                    item.id = item.$id + '_' + category;
                    return item;
                });
            })
            .then(function(list) {
                current.resolve(list);
            });

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
