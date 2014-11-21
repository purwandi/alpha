(function() {
    angular
        .module('app.sekolah.repository', [])

        /* @ngInject */
        .factory('AppSekolahRepository', function() 
        {
            var sekolah = {};

            return {
                sekolah: sekolah,
                update: function() {}
            }

        })
}) ();