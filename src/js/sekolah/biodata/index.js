(function() {
    angular
        .module('app.sekolah.biodata', [])

        /* @ngInject */
        .controller('AppSekolahBiodata', function($scope, AppSekolahRepository) {
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

            $scope.sekolah = {};


        // -----------------------------------------------------------------------
        // STEP
        // -----------------------------------------------------------------------
            $scope.nextstep = function(step) {
                $('.step').addClass('hide');
                $('#step-'+step).removeClass('hide');
            }
        // -----------------------------------------------------------------------
        // END STEP
        // -----------------------------------------------------------------------
         
        
        // -----------------------------------------------------------------------
        // WILAYAH OPT
        // -----------------------------------------------------------------------
            $scope.pickKota = function() {
                var kota = TAFFY(DAERAH.KOTA),
                    provinsi = parseInt($scope.sekolah.provinsi_id);
                $scope.config.wilayah.kota = kota({provinsi_id:{is:provinsi}}).get();
                $scope.config.wilayah.kecamatan = {};
                $scope.config.wilayah.desa = {};
            }

            $scope.pickKecamatan = function() {
                var kecamatan = TAFFY(DAERAH.KECAMATAN),
                    kota = parseInt($scope.sekolah.kota_id);
                $scope.config.wilayah.kecamatan = kecamatan({kota_id:{is:kota}}).get();
                $scope.config.wilayah.desa = {};
            }

            $scope.pickDesa = function() {
                console.debug($scope.sekolah.kecamatan_id);
                var desa = TAFFY(DAERAH.DESA),
                    kecamatan = parseInt($scope.sekolah.kecamatan_id);
                $scope.config.wilayah.desa = desa({kecamatan_id:{is:kecamatan}}).get();
            }
        // -----------------------------------------------------------------------
        // END WILAYAH OPT
        // -----------------------------------------------------------------------

            $scope.save = function() {
                // console.log(window.storageType);
                // window.storageType.set('biodata', $scope.sekolah);
                // console.log('sekolah');
            }
        })

})();