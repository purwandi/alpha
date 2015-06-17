(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahBiodataCtrl', SekolahBiodataCtrl)
        .controller('SekolahBiodataProgramCtrl', SekolahBiodataProgramCtrl);


    function SekolahBiodataCtrl($scope, $modal, $injector, sekolah, AppSekolahRepository) {
        // var $scope = this;

        // Injector
        var $validationProvider = $injector.get('$validation');

        // $scope.sekolah = {};
        $scope.config = {
            jenjang: APP.JENJANG,
            status: APP.STATUS,
            wilayah: {
                provinsi: DAERAH.PROVINSI
            }
        }

        $scope.form_program = true;

        // init()
        // -----------------------------------------------------------------------
        AppSekolahRepository.sekolah = sekolah;
        $scope.sekolah = AppSekolahRepository.sekolah;
        $scope.success = false;
        $scope.error = false;

        if (sekolah == undefined) {
            $scope.sekolah = { program: [] };
        } else if (sekolah.program == undefined) {
            $scope.sekolah.program = [];
        } else {
            $scope.sekolah.program = sekolah.program;
        }

        $scope.$watch(function() {
            return $scope.sekolah.jenjang_id;
        }, function(newValue, oldValue) {
            var _jenjang = parseInt($scope.sekolah.jenjang_id);

            if (oldValue != newValue) {
                $scope.sekolah.program = [];
            }

            if (_jenjang < 18) {

                if ($scope.sekolah.program == undefined) {
                    $scope.sekolah.program = [{
                        id: 200
                    }];
                } else {
                    //console.log($scope.sekolah.program);
                }

                console.log('Eksekusi');
                $scope.form_program = true;
            } else {
                $scope.form_program = false;
                if ($scope.sekolah.program == undefined) {
                    $scope.sekolah.program = [];
                }
            }
        });


        var update = function(value) {
            $scope.success = true;
            AppSekolahRepository.update(value);
        }


        // -----------------------------------------------------------------------
        // STEP
        // -----------------------------------------------------------------------
        $scope.save = function() {
            $scope.success = true;
            return AppSekolahRepository.update($scope.sekolah);
        }

        $scope.delete = function(index) {
            console.log('Hapus');
            $scope.sekolah.program.splice(index, 1);
        }


        // -----------------------------------------------------------------------
        // WILAYAH OPT
        // -----------------------------------------------------------------------
        //
        //
            $scope.$watch(function() {
                return $scope.sekolah.provinsi_id;
            }, function(oldValue, newValue) {
                var kota = TAFFY(DAERAH.KOTA),
                    provinsi = parseInt($scope.sekolah.provinsi_id);

                $scope.config.wilayah.kota = kota({provinsi_id:{is:provinsi}}).order('nama').get();
                $scope.config.wilayah.kecamatan = {};
                $scope.config.wilayah.desa = {};
            });

            $scope.$watch(function() {
                return $scope.sekolah.kota_id;
            }, function(oldValue, newValue) {
                var kecamatan = TAFFY(DAERAH.KECAMATAN),
                    kota = parseInt($scope.sekolah.kota_id);

                $scope.config.wilayah.kecamatan = kecamatan({kota_id:{is:kota}}).order('nama').get();
                $scope.config.wilayah.desa = {};
            });

            $scope.$watch(function() {
                return $scope.sekolah.kecamatan_id;
            }, function(oldValue, newValue) {
                var desa = TAFFY(DAERAH.DESA),
                    kecamatan = parseInt($scope.sekolah.kecamatan_id);

                $scope.config.wilayah.desa = desa({kecamatan_id:{is:kecamatan}}).order('nama').get();
            });

        // -----------------------------------------------------------------------
        // OPEN PROGRAM
        // -----------------------------------------------------------------------
            $scope.openProgram = function() {

                if ($scope.sekolah.jenjang_id != undefined) {
                    var modalInstance = $modal.open({
                        templateUrl: '/templates/sekolah-home.prodi.html',
                        controller: 'SekolahBiodataProgramCtrl',
                        scope: $scope
                    });

                    modalInstance.result.then(function(item) {
                        $scope.sekolah.program.push(item);
                        return update($scope.sekolah);
                    }, function(){
                        console.log('Modal dismiss at : '+new Date());
                    });
                } else {
                    return alert('Please select jenjang');
                }
            }

    }

    function SekolahBiodataProgramCtrl($scope, $modalInstance,  $injector) {
        var prodi       = TAFFY(APP.PRODI);
        var _sekolah    = $scope.sekolah;

        var $validationProvider = $injector.get('$validation');

        $scope.prodi = prodi({jenjang_id: {is:parseInt(_sekolah.jenjang_id)}}).order('nama').get();

        $scope.save = function() {
            $modalInstance.close($scope.program);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    }

})();