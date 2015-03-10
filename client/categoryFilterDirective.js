require('./mapDataService.js');
require('./templates/categoryFilterDirective.html');
var categories = require('./categories');

require('./akermap')
    .directive('categoryFilter',
    ['mapData', '$rootScope',
    function(mapData, $rootScope) {
        'use strict';

        function getRealSelected(selectedArray) {
            return selectedArray.filter(function(value) {
                return value !== false;
            });
        }

        var categoryArray = Object.keys(categories);

        return {
            restrict: 'E',
            replace: true,
            require: '^main',
            scope: true,
            templateUrl: require('./templates/categoryFilterDirective.html'),
            link: function(scope) {
                scope.categories = categoryArray;
                scope.selected = angular.copy(categoryArray);

                scope.$watchCollection('selected', function(now, old) {
                    if (now !== old) {
                        var real = getRealSelected(now);
                        // if all categories were selected, it is like no filter
                        mapData.setCategoryFilter(categoryArray.length !== real.length ? real : null);
                        $rootScope.$broadcast('updateFilters');
                    }
                });
            }
          };
    }]);
