$(document).ready(function() {

    if (!!window.chrome && chrome.storage) {
        console.log('Using chrome.storage.sync to save');
        window.storageType = 'ChromeStorage';
    } else {
        console.log('Using localStorage to save');
        window.storageType = 'LocalStorage';
    }

});

( function() {
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
        .filter('toAlpa', function() {
            return function(input) {
                if (input == 4) {
                    return 'A';
                } else if (input == 3) {
                    return 'B';
                } else if (input == 2) {
                    return 'C';
                } else if (input == 1) {
                    return 'D';
                } else {
                    return 'E';
                }
            }
        })
        .filter('toNumber', function() {
            return function(input) {
                if (input == 'A' || input == 'a') {
                    return 4;
                } else if (input == 'B' || input == 'b') {
                    return 3;
                } else if (input == 'C' || input == 'c') {
                    return 2;
                } else if (input == 'D' || input == 'd') {
                    return 1;
                } else {
                    return 0;
                }
            }
        })
} )();
