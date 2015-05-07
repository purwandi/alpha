(function() {
	'use strict';

	angular
		.module('app.asesor')
		.config(router)

	/* @ngInject */
	function router($stateProvider) {
		$stateProvider
			.state('asesor', {
				url: '/asesor',
				abstract: true,
				templateUrl: '/templates/asesor.html',
			})
			.state('asesor.home', {
				url: '',
				templateUrl: '/templates/asesor-index.html',
				controller: 'AppAsesorIndexCtrl',
				controllerAs: 'vm'
			})
			.state('asesor.base', {
				url: '/base',
				templateUrl: '/templates/asesor-base.html',
				controller: 'AppAsesorBaseCtrl',
				controllerAs: 'vm',
				resolve: {
					dataVisitasi: getDataRepository
				}
			})
			.state('asesor.visitasi', {
				url:'/visitasi/:npsn/:prodi',
				templateUrl: '/templates/asesor-visitasi.html',
				controller: 'AppAsesorVisitasiCtrl',
				controllerAs: 'vm',
				resolve: {
					dataVisitasi: getDataRepository
				}
			})
	}

	/* @ngInject */
	function getDataRepository(storage) {
		return storage.get('visitasi');
	}

})();