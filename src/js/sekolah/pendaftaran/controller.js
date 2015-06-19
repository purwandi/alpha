(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahPendaftaranCtrl', SekolahPendaftaranCtrl)
        .controller('SekolahCetakCtrl', SekolahCetakCtrl)


    function SekolahPendaftaranCtrl($scope, $state, $injector, AppSekolahRepository, sekolah, Request) {

        if ( ! sekolah) {
            $state.go('sekolah-home.biodata');
        }

        var $validationProvider = $injector.get('$validation');

        $scope.sekolah  = sekolah;
        $scope.error    = false;
        $scope.success  = false;

        $scope.data = {
            provinsi_id: sekolah.provinsi_id,
            jenjang_id: sekolah.jenjang_id,
            konten: App.Prepare.init(sekolah),
            npsn: sekolah.npsn
        }

        $scope.pendaftaran = function() {
            $scope.upload = true;
            Request.post('pengajuan', $scope.data)
                .then(function(response) {
                    $scope.success = true;
                    $scope.sekolah.kode = response.kode;
                    $scope.sekolah.created_at = response.created_at.date;

                    AppSekolahRepository.update($scope.sekolah);
                    console.log(response);
                }, function(error) {
                    $scope.error = true;
                    console.log(error);
                });
        }

    }

    function SekolahCetakCtrl($scope, sekolah) {
        $scope.sekolah = sekolah;
    }
})();