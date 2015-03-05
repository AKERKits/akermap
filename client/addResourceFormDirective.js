var categories = require('./data/categories.json');

require('./akermap').directive('addResourceForm', function($log) {
    'use strict';

    return {
        restrict: 'E',
        require: '^main',
        templateUrl: require('./templates/addResourceFormDirective.html'),
        link: function(scope) {
            scope.categories = categories;

            scope.submitForm = function() {
                $log.debug('form submitted...');
            };
        }
    };
});
