require('./akermap').directive('main', function() {
    'use strict';

    return {
        restrict: 'A',
        controller: function($scope) {

            $scope.filtersUpdated = function() {

            };
        }
    };
});
