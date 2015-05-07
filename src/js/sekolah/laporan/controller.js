(function() {
	'use strict';

	angular
		.module('app.sekolah')
		.controller('SekolahLaporanCtrl', SekolahLaporanCtrl)


	function SekolahLaporanCtrl($scope, sekolah) {
		$scope.sekolah = sekolah;
	}

})();