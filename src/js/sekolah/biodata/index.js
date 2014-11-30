(function() {
    angular
        .module('app.sekolah.biodata', ['ui.bootstrap', 'ui.bootstrap.tpls'])

        /* @ngInject */
        .controller('AppSekolahBiodataCtrl', function($scope, $modal, sekolah, AppSekolahRepository) {
            $scope.config = {
                jenjang : APP.JENJANG,
                status : APP.STATUS,
                wilayah: {
                    provinsi: DAERAH.PROVINSI,
                    kota: {},
                    kecamatan: {},
                    desa: {}
                }
            };

            var isArrayObject = function(object) {
                if (Object.prototype.toString.call(object) === '[object Array]') return true;
                else return false;
            }

        // -----------------------------------------------------------------------
        // RUNNER
        // -----------------------------------------------------------------------
           
            // init()
            // -----------------------------------------------------------------------
            AppSekolahRepository.sekolah = $scope.sekolah = sekolah;

            if (sekolah == undefined) {
                $scope.sekolah = { program: [] };
                console.log($scope.sekolah);
            } else if (sekolah.program == undefined) {
                console.log('Program undefined');
                $scope.sekolah.program = [];
            }
            

            /* if ($scope.hasOwnProperty('sekolah.program') == false ) {
                // || ! isArrayObject($scope.sekolah.program)
                $scope.sekolah.program = [];
                console.log('Program is instanceof');
            }
    */

            var update = function(value) {
                AppSekolahRepository.update(value);   
            }


        // -----------------------------------------------------------------------
        // END RUNNER
        // -----------------------------------------------------------------------
            

        // -----------------------------------------------------------------------
        // STEP
        // -----------------------------------------------------------------------
            $scope.nextstep = function(step) {
                return update($scope.sekolah);
            }
        // -----------------------------------------------------------------------
        // END STEP
        // -----------------------------------------------------------------------
         
        // -----------------------------------------------------------------------
        // OPEN PROGRAM
        // -----------------------------------------------------------------------
            $scope.openProgram = function() {

                if ($scope.sekolah.jenjang_id != undefined) {
                    var modalInstance = $modal.open({
                        templateUrl: '/templates/sekolah-program.html',
                        controller: 'AppSekolahBiodataProgramCtrl'
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
        // -----------------------------------------------------------------------
        // END STEP
        // -----------------------------------------------------------------------
         
        
        // -----------------------------------------------------------------------
        // WILAYAH OPT
        // -----------------------------------------------------------------------
        // 
        
            if ($scope.hasOwnProperty('sekolah.provinsi_id')) {
                $scope.$watch(function() {
                    return $scope.sekolah.provinsi_id;
                }, function(oldValue, newValue) {
                    var kota = TAFFY(DAERAH.KOTA),
                        provinsi = parseInt($scope.sekolah.provinsi_id);

                    $scope.config.wilayah.kota = kota({provinsi_id:{is:provinsi}}).order('nama').get();
                    $scope.config.wilayah.kecamatan = {};
                    $scope.config.wilayah.desa = {};
                });
            }

            if ($scope.hasOwnProperty('sekolah.kota_id')) {
                $scope.$watch(function() {
                    return $scope.sekolah.kota_id;
                }, function(oldValue, newValue) {
                    var kecamatan = TAFFY(DAERAH.KECAMATAN),
                        kota = parseInt($scope.sekolah.kota_id);

                    $scope.config.wilayah.kecamatan = kecamatan({kota_id:{is:kota}}).order('nama').get();
                    $scope.config.wilayah.desa = {};
                });
            }

            if ($scope.hasOwnProperty('sekolah.kecamatan_id')) {
                $scope.$watch(function() {
                    return $scope.sekolah.kecamatan_id;
                }, function(oldValue, newValue) {
                    var desa = TAFFY(DAERAH.DESA),
                        kecamatan = parseInt($scope.sekolah.kecamatan_id);

                    $scope.config.wilayah.desa = desa({kecamatan_id:{is:kecamatan}}).order('nama').get();
                });
            }

        // -----------------------------------------------------------------------
        // END WILAYAH OPT
        // -----------------------------------------------------------------------

        })

        .controller('AppSekolahBiodataProgramCtrl', function($scope, $modalInstance, AppSekolahRepository) {

            var prodi = TAFFY(APP.PRODI);

            $scope.sekolah = AppSekolahRepository.sekolah;
            $scope.prodi = prodi({jenjang_id: {is:parseInt($scope.sekolah.jenjang_id)}}).order('nama').get();
            

            $scope.save = function() {
                // $scope.sekolah.program.push($scope.program);
                $modalInstance.close($scope.program);
            }

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            }
        })

})();