require('angularfire'); // loads firebase

module.exports = angular.module('akermap', [
    'pascalprecht.translate',
    'uiGmapgoogle-maps',
    'firebase',
    'btford.modal',
    'ngSanitize'
]);
