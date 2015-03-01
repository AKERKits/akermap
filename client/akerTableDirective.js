require('./akermap').directive('akerTable', function(mapData, $log) {
    'use strict';

    return {
        restrict: 'E',
        require: '^main',
        templateUrl: require('./templates/akerTableDirective.html'),
        link: function(scope) {
            $log.debug('init akerTable');
            function updateRows() {
                mapData.get().then(function(rows) {
                    scope.rows = rows;
                });
            }

            updateRows();
            scope.$on('updateFilters', function() {
                $log.debug('updating rows');
                updateRows();
            });

        }
    };
});
