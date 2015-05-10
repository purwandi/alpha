(function() {
    'use srict';

    angular
        .module('app.app.directive.daerah', [])
        .directive('daerahProvinsi', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var provinsi = TAFFY(DAERAH.PROVINSI);
                    var value = provinsi({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahKota', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var kota = TAFFY(DAERAH.KOTA);
                    var value = kota({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahKecamatan', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var kecamatan = TAFFY(DAERAH.KECAMATAN);
                    var value = kecamatan({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahDesa', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var desa = TAFFY(DAERAH.DESA);
                    var value = desa({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
})();