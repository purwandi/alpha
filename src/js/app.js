$(document).ready(function() {

    if (!!window.chrome && chrome.storage) {
        console.log('Using chrome.storage.sync to save');
        window.storageType = 'ChromeStorage';
    } else {
        console.log('Using localStorage to save');
        window.storageType = 'LocalStorage';
    }

});

(function() {
    angular
        .module('app', [
            'ui.router',

            'app.directive.prodi',
            'app.directive.maxheight',
            'app.directive.affix',
            'app.app.directive.daerah',

            'templates',

            'app.base',
            'app.sekolah',
            'app.asesor'
        ])

        .config(function($locationProvider, $urlRouterProvider) {
            // $locationProvider.html5Mode(true);
            $urlRouterProvider
                .otherwise('/')
        })
}) ();
