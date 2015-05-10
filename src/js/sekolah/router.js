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
                url: '/',
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

            .state('sekolah-home.laporan', {
                url: '/laporan',
                controller: 'SekolahLaporanCtrl',
                templateUrl: '/templates/sekolah-home.laporan.html',
                resolve: {
                    sekolah: getSekolah
                }
            })
            .state('sekolah-home.pendaftaran', {
                url:'/pendaftaran',
                controller: 'SekolahPendaftaranCtrl',
                templateUrl: '/templates/sekolah-home.pendaftaran.html',
                resolve: {
                    sekolah: getSekolah
                }
            })
            .state('sekolah-home.cetak', {
                url:'/cetak',
                controller: 'SekolahCetakCtrl',
                templateUrl: '/templates/sekolah-home.cetak.html',
                resolve: {
                    sekolah: getSekolah
                }
            })


        function getSekolah(AppSekolahRepository) {
            return AppSekolahRepository.init();
        }
    }

})();