require('./akermap').directive('main', function() {
    'use strict';

    return {
        restrict: 'A',
        controller: function($scope) {
            $scope.showAddResourceForm = false;

            this.toggleShowAddResourceForm = function(toggleState) {
                $scope.showAddResourceForm = angular.isUndefined(toggleState) ? !$scope.showAddResourceForm : !!toggleState;
            };
        }
    };
});
