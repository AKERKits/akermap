require('./mapDataService.js');
var categories = require('./data/categories.json');

require('./akermap')
    .directive('categoryFilter', function(mapData, $rootScope) {
        'use strict';

        function getRealSelected(selectedArray) {
            return selectedArray.filter(function(value) {
                return value !== false;
            });
        }

        return {
            restrict: 'E',
            require: '^main',
            templateUrl: require('./templates/categoryFilterDirective.html'),
            link: function(scope, element, attrs, mainCtrl) {
                scope.categories = categories;
                scope.selected = angular.copy(categories);

                scope.$watchCollection('selected', function(now, old) {
                    if (now !== old) {
                        var real = getRealSelected(now);
                        // if all categories were selected, it is like no filter
                        mapData.setCategoryFilter(categories.length !== real.length ? real : null);
                        $rootScope.$broadcast('updateFilters');
                    }
                });
            }
          };
    });
