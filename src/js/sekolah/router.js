(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .config(router)

    /* @ngInject */
    function router($stateProvider) {
        $stateProvider
            .state('sekolah', {
                url: '/sekolah',
                templateUrl: '/templates/sekolah.html',
            })
            .state('sekolah-home',  {
                url: '/sekolah/home',
                abstract: true,
                templateUrl: '/templates/sekolah-home.html'
            })

            .state('sekolah-home.index', {
                url: '',
                templateUrl: '/templates/sekolah-home.index.html'
            })

            .state('sekolah-home.biodata', {
                url: '/biodata',
                controller: 'SekolahBiodataCtrl',
                templateUrl: '/templates/sekolah-home.biodata.html',
                resolve: {
                    sekolah: getSekolah
                }
            })

            .state('sekolah-home.instrumen', {
                url: '/instrumen',
                controller: 'SekolahInstrumenCtrl',
                templateUrl: '/templates/sekolah-home.instrumen.html',
                resolve: {
                    sekolah: getSekolah
                }
            })


        function getSekolah(AppSekolahRepository) {
            return AppSekolahRepository.init();
        }
    }

})();