(function() {
    angular
        .module('app.asesor', ['ui.router'])

        .config(function($stateProvider)
        {
            $stateProvider
                .state('asesor', 
                {
                    url: '/asesor',
                    abstract: true,
                    templateUrl: '/templates/asesor.html'
                })
                .state('asesor.biodata',
                {
                    url: '',
                    templateUrl: '/templates/asesor-biodata.html'
                })
        })
})();