(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahHomeCtrl', SekolahHomeCtrl);

    /* @ngInject */
    function SekolahHomeCtrl($scope, $injector, $state, msgService, Request, AppSekolahRepository) {

        // Injector
        var $validationProvider = $injector.get('$validation');

        $scope.getData = function() {
            Request
                .get('/pengajuan/' + $scope.token)
                .then(function(response) {
                    // console.log(JSON.parse(response.konten));
                    msgService.notif('Informasi', 'Pengambilan data dari server berhasil', 'info');
                    AppSekolahRepository.update(JSON.parse(response.konten));
                    $state.go('sekolah-home.biodata');
                }, function(error) {
                    msgService.notif('Informasi', 'Terjadi kesalahan, mohon reload browser anda dan coba kembali', 'alert');
                });
        }
    }
})();