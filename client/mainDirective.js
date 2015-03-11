require('./akermap').directive('main', function() {
    'use strict';

    return {
        restrict: 'A',
        controller: ['$scope', function($scope) {

            $scope.logo = require('./images/logo-horizontal.svg');
            $scope.iggLogo = require('./images/IGG_Logo_Frame_GOgenta_RGB.svg');
            $scope.twitterLogo = require('./images/social-media/twitter.svg');
            $scope.githubLogo = require('./images/social-media/github.svg');
            $scope.facebookLogo = require('./images/social-media/facebook-official.svg');

            $scope.menuIsOpen = false;
            $scope.toggleMenu = function(state) {
                $scope.menuIsOpen = angular.isUndefined(state) ? !$scope.menuIsOpen : !!state;
            };
        }]
    };
});
