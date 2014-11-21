$(document).ready(function() {
    var initialize;

    if (!!window.chrome && chrome.storage) {
        console.log('Using chrome.storage.sync to save');
        window.storageType = ChromeStorage;
    } else {
        console.log('Using localStorage to save');
        window.storageType = LocalStorage;
    }

    initialize = function() {

    }

    return initialize();

});

(function() {
    angular
        .module('app', [

            'app.base', 
            'app.sekolah', 
            'app.asesor'
        ])

        .filter('uri', function($location) {
            return {
                segment: function(segment) {
                    var data = $location.path().split("/");
                    if(data[segment-1]) { return data[segment-1]; }
                    return false;
                },
                total_segments: function() {
                    var data = $location.path().split("/");
                    var i = 0;
                    angular.forEach(data, function(value){
                        if(value.length) { i++; }
                    });
                    return i;
                }
            };
        });
}) ();
