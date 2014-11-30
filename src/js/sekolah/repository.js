(function() {
    angular
        .module('app.sekolah.repository', ['storage'])

        /* @ngInject */
        .factory('AppSekolahRepository', function(storage) {
            
            var sekolah = {};
            
            return {
                sekolah: sekolah,
                init: function() {
                    return storage.get('sekolah');
                },
                update: function(value) {
                    return storage.set('sekolah', value);
                }
            }

        })
}) ();