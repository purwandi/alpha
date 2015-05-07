(function() {
	'use strict';

	angular
		.module('app.asesor')
		.controller('AppAsesorIndexCtrl', AppAsesorIndexCtrl)
		.controller('AppAsesorBaseCtrl', AppAsesorBaseCtrl)
		.controller('AppAsesorVisitasiCtrl', AppAsesorVisitasiCtrl)

	function AppAsesorIndexCtrl($state, Request, storage) {
		var vm = this;
		vm.credentials = {};

		vm.verifikasi = verifikasi;

		function verifikasi() {
			return Request
				.post('visitasi/credentials', vm.credentials)
				.then(function(response) {
					storage.set('visitasi', response);
					$state.go('asesor.base');
				});
		}
	}

	function AppAsesorBaseCtrl(dataVisitasi) {
		var vm  = this;
		vm.data = dataVisitasi;
	}

	function AppAsesorVisitasiCtrl($stateParams, dataVisitasi) {
		var vm 			= this,
			visitasi 	= dataVisitasi,
			data 		= TAFFY(dataVisitasi.data),
			sekolah 	= data({ npsn: { is: $stateParams.npsn } }).first(),
			dataProdi 	= TAFFY(sekolah.data),
			prodi 		= dataProdi({ kode: {is: $stateParams.prodi } }).first();

		var _src_bagian,
			_bagian,
			_src_butir,
			_butir,
			_group_id;

		var __init_group  = function() {
            if (sekolah.jenjang_id == 20) {
                if ($scope.prodi_current == 224) {   // SDLB
                    _group_id = { group_id : 16 };
                } else if ($scope.prodi_current == 225) { // SMPLB
                    _group_id = { group_id : 17 };
                } else if ($scope.prodi_current == 226) {  // SMALB
                    _group_id = { group_id : 18 };
                }
            } else {
                _group_id   = getGroupIdJenjang(sekolah.jenjang_id);
            }
        }

		var __init_source = function() {
			_src_bagian = TAFFY(INSTRUMEN.BAGIAN);
			_src_butir 	= TAFFY(INSTRUMEN.BUTIR);
			_bagian     = _src_bagian({ group_id: { is: parseInt(_group_id.group_id) }});
			_butir    	= _src_butir()
                          	.join( _bagian, ['bagian_id', 'id'])
                            .order('nomor');
		}

		var __kalkulasi = function() {
			console.log(vm.visitasi);
		}
		
		// Initialize data
		// ===============================================================
		__init_group();
		__init_source();

		// Setup View Model
		// ===============================================================
		vm.sekolah 	= sekolah;
		vm.prodi 	= prodi;
		vm.bagian   = _bagian.get();
		vm.butir    = _butir.get();

		// API's
		// ===============================================================
		vm.onSelectButir = onSelectButir;

		function onSelectButir() {
			__kalkulasi();
		}
		
	}
	
})();