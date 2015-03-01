require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-google-maps');
require('angularfire');

module.exports = angular.module('akermap', [
    'pascalprecht.translate',
    'uiGmapgoogle-maps',
    'firebase',
    'ngTable'
]);
