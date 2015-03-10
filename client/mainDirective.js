require('./akermap').directive('main', function() {
    'use strict';

    return {
        restrict: 'A',
        controller: ['$scope', function($scope) {

            $scope.menuIsOpen = false;
            $scope.toggleMenu = function(state) {
                $scope.menuIsOpen = angular.isUndefined(state) ? !$scope.menuIsOpen : !!state;
            };
        }]
    };
});
