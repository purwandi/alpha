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
        var url = 'http://opr2.bap-sm.or.id';

        storage
            .get('visitasi')
            .then(function(data) {
                if (data) {
                    $state.go('asesor.base');
                }
            });

        vm.credentials = {};
        vm.verifikasi = verifikasi;

        function verifikasi() {
            if (!vm.credentials.token) {
                alert('Mohon masukkan token tim visitasi.');
            } else {
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
    }

    function AppAsesorBaseCtrl($state, dataVisitasi, storage) {
        var vm = this;
        vm.data = dataVisitasi;
        vm.reset = reset;

        function reset() {
            storage.remove('visitasi');
            $state.go('asesor.home')
        }
    }

    function AppAsesorVisitasiCtrl($stateParams, $scope, storage, msgService, dataVisitasi) {
        var vm = this;
        vm.data = TAFFY(dataVisitasi.data);
        vm.sekolah = vm.data({
            npsn: {
                is: $stateParams.npsn
            }
        }).first();

        vm.total = 0;
        vm.tab = 'instrumen';
        vm.token = dataVisitasi.token;

        vm.next = nextFunction;
        vm.prev = prevFunction;
        vm.onKeyPress = keyPressFunction;
        vm.switchTab = switchTabFunction;
        vm.saveRekomendasi = saveRekomendasiFunction;
        vm.save = saveFunction;
        vm.sinkronisasi = syncFunction;


        var src_bagian = TAFFY(INSTRUMEN.BAGIAN);
        var src_butir = TAFFY(INSTRUMEN.BUTIR);
        var bagian = src_bagian({
            group_id: {
                is: parseInt(vm.sekolah.group_id)
            }
        });

        var butir = TAFFY(vm.sekolah.prodi.butir);
        var komponen = TAFFY(vm.sekolah.prodi.komponen);

        vm.sekolah.prodi.butir.forEach(function(entry) {
            var intrumen = src_butir({
                id: {
                    is: parseInt(entry.soal_id)
                }
            }).join(bagian, ['bagian_id', 'id']);

            if (entry.instrumen == undefined) {
                var inst = intrumen.first();
                butir({
                    soal_id: entry.soal_id
                }).update({
                    nomor: inst.nomor,
                    bagian_id: inst.bagian_id,
                    instrumen: inst
                });

                console.log(inst.nomor);
                console.log('update instrumen');
            }
        });

        vm.sekolah.prodi.butir = butir().get();
        vm.total = butir().count();

        saveToStorage();

        vm.nomor = 1;

        $scope.$watch('vm.nomor', function(current, original) {

            if (current == null) {
                current = vm.nomor;
            }

            if (current != '') {
                if (original < 0 || original > vm.total) {
                    butir({
                        nomor: parseInt(original)
                    }).update({
                        instrumen: vm.instrumen
                    });
                } else {
                    vm.instrumen = butir({
                        nomor: {
                            is: parseInt(vm.nomor)
                        }
                    }).first();
                }
            }

            saveToStorage();
        });

        function keyPressFunction(event) {
            if (event.keyCode < 65) {
                alert('Hanya bisa di isi huruf : A, B, C, D dan E');
            } else if (event.keyCode > 69) {
                if (event.keyCode < 97 || event.keyCode > 101) {
                    alert('Hanya bisa di isi huruf : A, B, C, D dan E');
                }
            }
        }

        function nextFunction() {
            if (vm.total > vm.nomor) {
                if (validateButir()) {
                    vm.nomor = parseInt(vm.nomor) + 1;
                }
            }
            saveToStorage();
        }

        function prevFunction() {
            if (vm.nomor != 1) {
                if (validateButir()) {
                    vm.nomor = parseInt(vm.nomor) - 1;
                }
            }
            saveToStorage();
        }

        function validateButir() {

            console.log(vm.instrumen.visitasi.jawabanHuruf);
            var status = true;

            if (vm.instrumen.visitasi.asesor1Huruf == undefined) {
                status = false;
            }
            if (vm.instrumen.visitasi.asesor2Huruf == undefined) {
                status = false;
            }
            if (vm.instrumen.visitasi.jawabanHuruf == undefined) {
                status = false;
            }
            if (vm.instrumen.visitasi.ket == '') {
                status = false;
            }

            if (status == false) {
                alert('Mohon lengkapi form terlebih dahulu.');
                return false;
            } else {
                return true;
            }

        }

        function saveToStorage() {
            App.Visitasi.init(bagian, butir, komponen);
            var hasil = App.Visitasi.hasil();

            vm.sekolah.prodi.hasil.visitasi.nilai = hasil.nilai;
            vm.sekolah.prodi.hasil.visitasi.peringkat = hasil.peringkat;
            vm.sekolah.prodi.hasil.visitasi.nilai_akhir = hasil.nilai_akhir;
            vm.sekolah.prodi.hasil.visitasi.peringkat_akhir = hasil.peringkat_akhir;

            storage.set('visitasi', {
                token: dataVisitasi.token,
                data: vm.data().get()
            });
        }

        function saveFunction() {
            saveToStorage;
            alert('Butir telah berhasil di simpan.');
        }

        function saveRekomendasiFunction() {
            var status = true;
            vm.sekolah.prodi.komponen.forEach(function(entry) {
                if (entry.visitasi.ket == '' || entry.visitasi.ket == undefined) {
                    if (status == true) {
                        alert('Rekomendasi : ' + entry.instrumen.nama + ' : harus di isi');
                        status = false;
                    }
                } else {
                    if (entry.visitasi.ket.length <= 400) {
                        if (status == true) {
                            alert('Rekomendasi : ' + entry.instrumen.nama + ' : minimal 400 huruf.');
                            status = false;
                        }
                    } else {
                        saveToStorage();
                    }
                }
            });

            if (status == true) {
                alert('Simpan rekomendasi telah berhasil di lakukan.')
            }
        }

        function switchTabFunction(tab) {
            vm.tab = tab;
            return false;
        }

        function syncFunction() {

            if (vm.sekolah.prodi.hasil.visitasi.dokumen == '') {
                alert('Mohon upload terlebih dahulu instrumen pengumpulan data dan informasi');
            }

            var url = 'http://opr2.bap-sm.or.id';
            var request = window.superagent;
            var data = {
                token: vm.token,
                program_id: vm.sekolah.prodi.kode,
                sekolah_prodi_id: vm.sekolah.prodi.id,
                butir: [],
                komponen: [],
                hasil: vm.sekolah.prodi.hasil.visitasi
            };

            vm.sekolah.prodi.butir.forEach(function(record) {
                data.butir.push({
                    soal_id: record.soal_id,
                    tahun: record.tahun,
                    asesor1: record.visitasi.asesor1,
                    asesor2: record.visitasi.asesor2,
                    jawaban: record.visitasi.jawaban,
                    hasil: record.visitasi.hasil,
                    notes: record.visitasi.ket
                });
            });

            vm.sekolah.prodi.komponen.forEach(function(record) {
                data.komponen.push({
                    komponen_id: record.komponen_id,
                    skor: record.visitasi.skor,
                    nilai: record.visitasi.nilai,
                    ratusan: record.visitasi.nilai_ratusan,
                    layak: record.visitasi.kelayakan,
                    rekomendasi: record.visitasi.ket
                });
            })

            request
                .post(url + '/api/v-lapor/')
                .send(data)
                .end(function(err, resp) {
                    if (err) {
                        msgService.notif('Informasi', err.error, 'alert');
                    } else {
                        console.log(resp.body);
                        vm.sekolah.prodi.hasil.last_sync = resp.body.date;
                        saveToStorage();
                        console.log(vm.sekolah.prodi.hasil);
                        // storage.set('visitasi', resp.body);
                        msgService.notif('Informasi', 'Proses sinkronisasi server berhasil', 'info');
                        // $state.go('asesor.base');
                    }

                });

            console.log(data);
        }
    }

} )();