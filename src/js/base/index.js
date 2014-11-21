(function() {
    angular
        .module('app.base', ['ui.router'])

        .config(function($stateProvider, $urlRouterProvider) 
        {
            $urlRouterProvider
                .otherwise('/');

            $stateProvider
                .state('home', 
                {
                    url: '/',
                    templateUrl: '/templates/home.html'
                })
                .state('laporan', 
                {
                    url: '/laporan',
                    templateUrl: '/templates/sekolah-biodata.html'
                })
        })
})();