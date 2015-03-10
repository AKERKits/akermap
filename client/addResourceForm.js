require('./formModal.js');
var _ = require('lodash');
require('./akermap').controller('addResourceForm',
    ['$scope', '$log', 'formModal', 'mapData', '$rootScope',
    function($scope, $log, formModal, mapData, $rootScope) {
    'use strict';

    $scope.closeClick = function() {
        formModal.deactivate();
    };

    $scope.categories = require('./categories');

    $scope.isAtLeastOneTypeSelected = function(items) {
        return _.any(items);
    };

    var resetForm = $scope.resetForm = function() {
        $scope.resource = {
            categories: []
        };
    };

    // init
    resetForm();

    $scope.submitForm = function() {
        var data = angular.copy($scope.resource);
        data.categories = _.filter(data.categories);
        angular.extend(data, formModal.data);
        $log.debug('form submitted...', data);
        mapData.add(data).then(function() {
            formModal.deactivate();
            $rootScope.$broadcast('updateFilters');
        });
    };
}]);
