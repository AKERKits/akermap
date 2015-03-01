var Firebase = require('exports?Firebase!firebase');
var _ = require('lodash');
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
            .then(function applyCategoryFilter(list) {
                var selectedCategories = self.getCategoryFilter();
                if (selectedCategories !== null && selectedCategories.length > 0) {
                  return list.filter(function(item) {
                      // if we have at least one matching category, it is part of the result
                      return _.intersection(item.categories, selectedCategories).length > 0;
                  });
                }
                return list;
            })
            .then(current.resolve);

          return current.promise;
      };

      MapDataService.prototype.setCategoryFilter = function(categories) {
          $log.debug('setting filter to',  categories);
          this.categoryFilter = categories;
          current = null;
      };

      MapDataService.prototype.getCategoryFilter = function() {
          return this.categoryFilter;
      };



      return new MapDataService();
    });
