require('./akermap')
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            //libraries: 'weather,geometry,visualization'
        });
    })

    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            'CATEGORY_BEES': 'Bees',
            'CATEGORY_BEEKEEPING_EQUIPMENT': 'Beekeeping Equipment',
            'CATEGORY_CHICKENS': 'Chickens',
            'CATEGORY_PLANTS': 'Houseplants & Seedlings',
            'CATEGORY_SEEDS': 'Seeds',
            'CATEGORY_SOIL': 'Soil & Compost',
            'CATEGORY_WORMS': 'Worms',
            'CATEGORY_OTHER': 'Other: General Agricultural Supplies'
        });

        $translateProvider.translations('de', {
          'CATEGORY_BEES': 'Bienen',
          'CATEGORY_BEEKEEPING_EQUIPMENT': 'Imkerzubehör',
          'CATEGORY_CHICKENS': 'Hühner',
          'CATEGORY_PLANTS': 'Hauspflanzen & Setzlinge',
          'CATEGORY_SEEDS': 'Samen',
          'CATEGORY_SOIL': 'Erde & Kompost',
          'CATEGORY_WORMS': 'Würmer',
          'CATEGORY_OTHER': 'Andere: Allgemeine Güter für den Agrikulturbereich'
        });

        $translateProvider.preferredLanguage('en');
    }]);
