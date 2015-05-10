(function() {
	'use strict';

	angular
		.module('app.sekolah')
		.controller('SekolahLaporanCtrl', SekolahLaporanCtrl)


	function SekolahLaporanCtrl($scope, $state, sekolah) {


        if ( ! sekolah) {
            $state.go('sekolah-home.biodata');
        }

		$scope.sekolah = sekolah;
		$scope.program = {};
		$scope.prodi_current = false;
        $scope.biodata = false;

		$scope.goEvaluasi = function(prodi) {
			if ($scope.prodi_current == false) {

                if (prodi == 'biodata') {
                    $scope.biodata = true;
                }

				$scope.prodi_current = parseInt(prodi);
				$('.prodi-evaluasi').addClass('hide');
                $('.prodi-'+prodi).removeClass('hide');

				var _index      = findIndexByKeyValue(sekolah.program, 'id', $scope.prodi_current);
            	var _program    = sekolah.program[_index];
            	$scope.program  = _program;

			} else {
                if (prodi == 'biodata') {
                    $scope.biodata = false;
                }
				$scope.prodi_current = false;
				$scope.butir 	= {};
				$scope.program 	= {};
				$('.prodi-evaluasi').removeClass('hide');
			}
		}
	}

})();