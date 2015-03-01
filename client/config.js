(function() {
    'use strict';
    var isDebug = true;

    require('./akermap')
        .constant('firebaseLocation', 'https://akermap.firebaseio.com')
        .constant('isDebug', isDebug)
        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                v: '3.18'
                //    key: 'your api key',
                //libraries: 'weather,geometry,visualization,places'
            });
        })
        .config(function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');
        })
        .config(function($logProvider) {
            $logProvider.debugEnabled(isDebug);
        })
        .run(function(uiGmapLogger) {
            uiGmapLogger.currentLevel = isDebug ? uiGmapLogger.LEVELS.debug : uiGmapLogger.LEVELS.error;
        });
})();
