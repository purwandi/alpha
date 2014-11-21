(function() {
    angular
        .module('app.sekolah', [
            'ui.router',
            'app.sekolah.repository',
            'app.sekolah.biodata'
        ])

        .config(function($stateProvider)
        {
            $stateProvider
                .state('sekolah',
                {
                    url: '/sekolah',
                    abstract: true,
                    templateUrl: '/templates/sekolah.html'
                })
                .state('sekolah.home', 
                {
                    url: '',
                    templateUrl: '/templates/sekolah-home.html'
                })
                .state('sekolah.biodata', 
                {
                    url: '/biodata',
                    controller: 'AppSekolahBiodata',
                    templateUrl: '/templates/sekolah-biodata.html'
                })
                
                .state('sekolah.instrumen',
                {
                    url: '/instrumen',
                    templateUrl: '/templates/sekolah-instrumen.html'
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