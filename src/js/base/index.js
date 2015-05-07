(function() {
    angular
        .module('app.base', [])
        .config(router)

    function router($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html'
            })
    }
})();