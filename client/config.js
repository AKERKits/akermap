(function() {
    'use strict';
    var isDebug = false;
    var languages = ['en', 'de'];

    require('./akermap')
        .constant('firebaseLocation', 'https://akermap.firebaseio.com')
        .constant('isDebug', isDebug)
        .config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                v: '3.18',
                //    key: 'your api key',
                //libraries: 'weather,geometry,visualization,places'
            });
        }])
        .config(['$translateProvider', function ($translateProvider) {
            /*
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });
            */
            // let's try loading the language files via webpack directly and see how that goes
            // if it doesn't work well we can switch back to the static files loader
            languages.forEach(function(language) {
                $translateProvider.translations(language, require('./i18n/' + language + '.json'));
            });
            $translateProvider.preferredLanguage(languages[0]);
        }])
        .config(['$logProvider', function($logProvider) {
            $logProvider.debugEnabled(isDebug);
        }])
        .run(['uiGmapLogger', function(uiGmapLogger) {
            uiGmapLogger.currentLevel = isDebug ? uiGmapLogger.LEVELS.debug : uiGmapLogger.LEVELS.error;
        }]);
})();
