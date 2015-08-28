( function() {
    'use strict';

    angular
        .module('app.asesor')
        .controller('AppAsesorIndexCtrl', AppAsesorIndexCtrl)
        .controller('AppAsesorBaseCtrl', AppAsesorBaseCtrl)
        .controller('AppAsesorVisitasiCtrl', AppAsesorVisitasiCtrl)

    function AppAsesorIndexCtrl($state, msgService, storage) {
        var vm = this;
        var request = window.superagent;
        var url = 'http://192.168.61.129:8000';

        /*storage
            .get('visitasi')
            .then(function(data) {
                if (data) {
                    $state.go('asesor.base');
                }
            });*/

        vm.credentials = {};
        vm.verifikasi = verifikasi;

        function verifikasi() {
            var target = url + '/api/visitasi/' + vm.credentials.token;

            request
                .get(target)
                .end(function(err, resp) {
                    if (err) {
                        msgService.notif('Informasi', 'Terjadi kesalahan, token tidak ditemukan', 'alert');
                    } else {
                        storage.set('visitasi', resp.body);
                        msgService.notif('Informasi', 'Pengambilan data dari server berhasil', 'info');
                        $state.go('asesor.base');
                    }

                });
        }
    }

    function AppAsesorBaseCtrl(dataVisitasi) {
        var vm = this;
        vm.data = dataVisitasi;
    }

    function AppAsesorVisitasiCtrl($stateParams, dataVisitasi) {
        var vm = this;
        var visitasi = dataVisitasi;
        var data = TAFFY(dataVisitasi.data);
        var sekolah = data({
            npsn: {
                is: $stateParams.npsn
            }
        }).first();
        var dataProdi = TAFFY(sekolah.data);
        var prodi = dataProdi({
            kode: {
                is: $stateParams.prodi
            }
        }).first();

        var _src_bagian;
        var _bagian;
        var _src_butir;
        var _butir;
        var _group_id;

        var __init_group = function() {
            if (sekolah.jenjang_id == 20) {
                if ($scope.prodi_current == 224) { // SDLB
                    _group_id = {
                        group_id: 16
                    };
                } else if ($scope.prodi_current == 225) { // SMPLB
                    _group_id = {
                        group_id: 17
                    };
                } else if ($scope.prodi_current == 226) { // SMALB
                    _group_id = {
                        group_id: 18
                    };
                }
            } else {
                _group_id = getGroupIdJenjang(sekolah.jenjang_id);
            }
        }














































        var __init_source = function() {
            _src_bagian = TAFFY(INSTRUMEN.BAGIAN);
            _src_butir = TAFFY(INSTRUMEN.BUTIR);
            _bagian = _src_bagian({
                group_id: {
                    is: parseInt(_group_id.group_id)
                }
            });
            _butir = _src_butir()
                .join(_bagian, ['bagian_id', 'id'])
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
        vm.sekolah = sekolah;
        vm.prodi = prodi;
        vm.bagian = _bagian.get();
        vm.butir = _butir.get();

        // API's
        // ===============================================================
        vm.onSelectButir = onSelectButir;

        function onSelectButir() {
            __kalkulasi();
        }

    }

} )();