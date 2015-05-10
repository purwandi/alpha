(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahPendaftaranCtrl', SekolahPendaftaranCtrl)
        .controller('SekolahCetakCtrl', SekolahCetakCtrl)


    function SekolahPendaftaranCtrl($scope, $injector, AppSekolahRepository, sekolah, Request) {

        var $validationProvider = $injector.get('$validation');

        $scope.sekolah  = sekolah;
        $scope.error    = false;
        $scope.success  = false;

        $scope.data = {
            provinsi_id: sekolah.provinsi_id,
            pemohon_nama: 'Purwandi M',
            pemohon_nik: '1234567890123456',
            jenjang_id: sekolah.jenjang_id,
            konten: sekolah,
            npsn: sekolah.npsn
        }

        $scope.pendaftaran = function() {
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