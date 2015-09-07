( function() {
    'use strict';

    // var url = 'http://192.168.61.129:8000';
    var url = 'http://opr2.bap-sm.or.id';

    angular
        .module('app.asesor')
        .controller('AppAsesorIndexCtrl', AppAsesorIndexCtrl)
        .controller('AppAsesorBaseCtrl', AppAsesorBaseCtrl)
        .controller('AppAsesorVisitasiCtrl', AppAsesorVisitasiCtrl);


    function loaderUp() {
        $('body').addClass('app-loading');
    }

    function loaderClose() {
        setTimeout((function() {
            $('body').removeClass('app-loading');
        }), 1000);
    }

    function AppAsesorIndexCtrl($state, msgService, storage) {
        var vm = this;
        var request = window.superagent;

        vm.url = url;

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
                msgService.notif('Error', 'Mohon masukkan token tim visitasi', 'alert', true);
            } else {
                msgService.notif('Informasi', 'Harap menunggu, proses pengambilan data sedang berjalan', 'alert', true);
                var target = url + '/api/visitasi/' + vm.credentials.token;
                loaderUp();
                request
                    .get(target)
                    .end(function(err, resp) {
                        if (err) {
                            msgService.notif('Error', 'Terjadi kesalahan, token tidak ditemukan', 'alert', true);
                        } else {
                            storage.set('visitasi', resp.body);
                            msgService.notif('Informasi', 'Pengambilan data dari server berhasil', 'info', true);
                            $state.go('asesor.base');
                        }
                        loaderClose();
                    });
            }
        }
    }

    function AppAsesorBaseCtrl($state, dataVisitasi, storage) {
        var vm = this;
        vm.data = dataVisitasi;
        vm.reset = reset;
        vm.url = url;
        vm.token = dataVisitasi.token;
        vm.visitasi = visitasi;
        vm.stateProdiIsFalse = false;

        storage
            .get('visitasi')
            .then(function(data) {
                if (!data) {
                    $state.go('asesor.home');
                }
            });

        function reset() {
            storage.remove('visitasi');
            $state.go('asesor.home')
        }

        function visitasi(npsn, prodi) {
            storage.set('visitasi', vm.data);
            $state.go('asesor.visitasi', {
                npsn: npsn,
                prodi: prodi
            })
        }
    }

    function AppAsesorVisitasiCtrl($state, $stateParams, $scope, storage, msgService, dataVisitasi) {

        storage
            .get('visitasi')
            .then(function(data) {
                if (!data) {
                    $state.go('asesor.home');
                }
            });

        var vm = this;
        vm.data = TAFFY(dataVisitasi.data);
        /* vm.sekolah = vm.data({
            npsn: {
                is: $stateParams.npsn,
            },
            prodi_id: {
                is: $stateParams.prodi,
            }
        }).first();*/
        vm.sekolah = vm.data({
            npsn: $stateParams.npsn,
            prodi_id: parseInt($stateParams.prodi)
        }).first();

        if (!vm.sekolah) {
            msgService.notif('Error', 'Terdapat perbaikan aplikasi, data program tidak ditemukan. Mohon melakukan reset token dan memasukkan token ulang.', 'alert');
            $state.go('asesor.home');
            return;
        }

        vm.sekolah.prodi.hasil.last_sync = vm.sekolah.prodi.hasil.last_sync ? vm.sekolah.prodi.hasil.last_sync : '';
        vm.sekolah.prodi.hasil.visitasi.dokumentasi = vm.sekolah.prodi.hasil.visitasi.dokumentasi ? vm.sekolah.prodi.hasil.visitasi.dokumentasi : [];
        vm.total = 0;
        vm.tab = 'instrumen';
        vm.token = dataVisitasi.token;
        vm.url = url;

        vm.next = nextFunction;
        vm.prev = prevFunction;
        vm.onKeyPress = keyPressFunction;
        vm.switchTab = switchTabFunction;
        vm.saveRekomendasi = saveRekomendasiFunction;
        vm.save = saveFunction;
        vm.sinkronisasi = syncFunction;
        vm.toTT = toTTFunction;
        vm.openCropit = openCropitFunction;
        vm.closeCropit = closeCropitFunction;
        vm.removeFoto = removeFotoFunction;


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

                //console.log(inst.nomor);
                //console.log('update instrumen');
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
                msgService.notif('Error', 'Hanya bisa di isi huruf : A, B, C, D dan E', 'alert');
            } else if (event.keyCode > 69) {
                if (event.keyCode < 97 || event.keyCode > 101) {
                    // alert('Hanya bisa di isi huruf : A, B, C, D dan E');
                    msgService.notif('Error', 'Hanya bisa di isi huruf : A, B, C, D dan E', 'alert');
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
                // if (validateButir()) {
                vm.nomor = parseInt(vm.nomor) - 1;
                //}
            }
            saveToStorage();
        }

        function validateButir() {

            // console.log(vm.instrumen.visitasi.jawabanHuruf);
            var status = true;

            if (vm.instrumen.visitasi.asesor1Huruf == undefined) {
                msgService.notif('Error', 'Pernyataan asesor I tidak boleh kosong.', 'alert', true);
                status = false;
            }
            if (vm.instrumen.visitasi.asesor2Huruf == undefined) {
                msgService.notif('Error', 'Pernyataan asesor II tidak boleh kosong.', 'alert', true);
                status = false;
            }
            if (vm.instrumen.visitasi.jawabanHuruf == undefined) {
                msgService.notif('Error', 'Pernyataan tim tidak boleh kosong.', 'alert', true);
                status = false;
            }

            // console.log('Evaluasi : ' + vm.instrumen.evaluasi.jawaban);
            // console.log('Visitasi : ' + vm.instrumen.visitasi.jawaban);

            if (vm.instrumen.visitasi.jawaban != vm.instrumen.evaluasi.jawaban) {
                if (vm.instrumen.visitasi.ket == '') {
                    msgService.notif('Error', 'Terdapat perbedaan antara pernyataan sekolah dengan pernyataan hasil visitasi, mohon untuk mengisi keterangan perbedaan tersebut', 'alert', true);
                    status = false;
                } else {
                    if (vm.instrumen.visitasi.ket.length <= 100) {
                        msgService.notif('Error', 'Catatan yang di isi minimal 100 karakter', 'alert', true);
                        status = false;
                    }
                }
            }

            if (status == false) {
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
                data: vm.data().get(),
                asesor: dataVisitasi.asesor
            });
        }

        function saveFunction() {
            saveToStorage();
            msgService.notif('Success', 'Pengisian butir visitasi berhasil disimpan', 'info');
        }

        function saveRekomendasiFunction() {
            var status = true;
            vm.sekolah.prodi.komponen.forEach(function(entry) {
                if (entry.visitasi.ket == '' || entry.visitasi.ket == undefined) {
                    if (status == true) {
                        msgService.notif('Error', 'Rekomendasi : ' + entry.instrumen.nama + ' : harus di isi', 'alert', true);
                        status = false;
                    }
                } else {
                    if (entry.visitasi.ket.length <= 400) {
                        if (status == true) {
                            msgService.notif('Error', 'Rekomendasi : ' + entry.instrumen.nama + ' : harus di isi minimal 400 huruf', 'alert', true);
                            // alert('Rekomendasi : ' + entry.instrumen.nama + ' : minimal 400 huruf.');
                            status = false;
                        }
                    } else {
                        saveToStorage();
                    }
                }
            });

            if (status == true) {
                msgService.notif('Success', 'Simpan rekomendasi telah berhasil di lakukan.', 'info');
                // alert('Simpan rekomendasi telah berhasil di lakukan.')
            }
        }

        function switchTabFunction(tab) {
            vm.tab = tab;
            return false;
        }

        function syncFunction() {
            if (vm.sekolah.prodi.hasil.visitasi.dokumen == '' || vm.sekolah.prodi.hasil.visitasi.dokumen == undefined) {
                msgService.notif('Error', 'Mohon upload terlebih dahulu instrumen pengumpulan data dan informasi', 'alert');
            // alert('Mohon upload terlebih dahulu instrumen pengumpulan data dan informasi');
            } else {
                if (vm.sekolah.prodi.hasil.visitasi.dokumentasi.length == 0) {
                    msgService.notif('Error', 'Dokumentasi foto masih kosong, mohon untuk melakukan upload dokumentasi terlebih dahulu', 'alert');
                } else {
                    vm.sekolah.prodi.hasil.visitasi.notes = '';
                    syncronization();
                }
            }
        }

        function toTTFunction() {

            // alert(vm.sekolah.prodi.hasil.visitasi.notes);
            if (vm.sekolah.prodi.hasil.visitasi.notes == '' || vm.sekolah.prodi.hasil.visitasi.notes == undefined) {
                msgService.notif('Error', 'Keterangan tidak boleh kosong', 'alert');
            } else {
                vm.sekolah.prodi.hasil.visitasi.dokumen = '';
                syncronization();
            }
        }

        function syncronization() {

            if ($scope.online == true) {
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
                });

                loaderUp();
                msgService.notif('Informasi', 'Harap menunggu, proses sinkronisasi sedang berjalan', 'alert', true);

                request
                    .post(url + '/api/v-lapor/')
                    .send(data)
                    .end(function(err, resp) {
                        if (err) {
                            console.log(err);
                            msgService.notif('Error', resp.body.error, 'alert', true);
                        } else {
                            console.log(resp.body);
                            vm.sekolah.prodi.hasil.last_sync = resp.body.date;
                            console.log(vm.sekolah.prodi.hasil.last_sync);
                            saveToStorage();
                            // console.log(vm.sekolah.prodi.hasil);
                            // storage.set('visitasi', resp.body);
                            msgService.notif('Informasi', 'Proses sinkronisasi server berhasil', 'info', true);
                            // $state.go('asesor.base');
                        }
                        loaderClose();

                    });
            } else {
                msgService.notif('Error', 'Tidak dapat melakukan sinkronisasi. Koneksi internet terputus', 'alert', true);
            }
        }

        function openCropitFunction() {

            $('.image-editor').cropit({
                type: 'image/jpeg',
                quality: 0.5,
                exportZoom: 1.25,
                imageBackground: true,
                imageBackgroundBorderWidth: 20,
                onImageLoading: function() {
                    $('.spinner').removeClass('hide');
                },
                onImageLoaded: function() {
                    $('.spinner').addClass('hide');
                },
                onImageError: function() {
                    msgService.notif('Error', 'Tidak dapat melakukan upload foto, coba ganti foto dengan yang lain.', 'alert', true);
                }
            });


            $('#upload-canvas').modal('show');
        }

        function removeFotoFunction(index) {
            vm.sekolah.prodi.hasil.visitasi.dokumentasi.splice(index, 1);
            saveToStorage();
        }

        function closeCropitFunction() {

            if ($scope.online == true) {
                // console.log('Crop sedang berlangsung');
                var imageData = $('.image-editor').cropit('export');

                if (imageData) {
                    var request = window.superagent;

                    loaderUp();
                    msgService.notif('Informasi', 'Harap menunggu, proses upload foto sedang berjalan', 'alert', true, true);

                    request
                        .post(url + '/api/v-dokumentasi')
                        .send({
                            file: imageData
                        })
                        .end(function(err, resp) {
                            if (err) {
                                msgService.notif('Error', resp.body.error, 'alert', true);
                            } else {
                                vm.sekolah.prodi.hasil.visitasi.dokumentasi.push({
                                    image: resp.body.url,
                                    notes: $('#notes').val()
                                });

                                saveToStorage();
                                $scope.$apply();
                                $('.cropit-image-preview')
                                    .removeClass('cropit-image-loaded')
                                    .css('background-image', '');
                                $('#notes').val('');
                                msgService.notif('Informasi', 'Proses upload foto berhasil', 'info', true);
                                $('#upload-canvas').modal('hide');
                            }

                            loaderClose();
                        })
                } else {
                    msgService.notif('Error', 'Foto yang di upload belum dipilih', 'alert', true);
                }
            } else {
                msgService.notif('Error', 'Tidak dapat melakukan upload foto. Koneksi internet terputus', 'alert', true);
            }
        }
    }

} )();