(function() {
    angular
        .module('app.sekolah', [
            'ui.router',
            'app.directive.prodi',
            'app.sekolah.repository',
            'app.sekolah.biodata',
            'app.sekolah.evaluasi'
        ])

        .config(function($stateProvider)
        {
            $stateProvider
                .state('sekolah',
                {
                    url: '/sekolah',
                    abstract: true,
                    templateUrl: '/templates/sekolah.html',
                    resolve: {
                        sekolah: function(AppSekolahRepository) {
                            return AppSekolahRepository.init();
                        }
                    }
                })
                .state('sekolah.home', 
                {
                    url: '',
                    templateUrl: '/templates/sekolah-home.html'
                })
                .state('sekolah.biodata', 
                {
                    url: '/biodata',
                    templateUrl: '/templates/sekolah-biodata.html',
                    controller: 'AppSekolahBiodataCtrl'
                    
                })
                .state('sekolah.instrumen',
                {
                    url: '/instrumen',
                    templateUrl: '/templates/sekolah-instrumen.html',
                    controller: 'AppSekolahEvaluasiCtrl'
                })
                .state('sekolah.laporan',
                {
                    url: '/laporan',
                    templateUrl: '/templates/sekolah-laporan.html'
                })

                .state('sekolah.pendaftaran',
                {
                    url: '/pendaftaran',
                    templateUrl: '/templates/sekolah-pendaftaran.html'
                })
        })
})();