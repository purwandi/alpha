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

            'app.base', 
            'app.sekolah', 
            'app.asesor'
        ])
}) ();
