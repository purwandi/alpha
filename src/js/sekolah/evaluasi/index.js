(function() {
    angular
        .module('app.sekolah.evaluasi', [])

        /* @ngInject */
        .controller('AppSekolahEvaluasiCtrl', function($scope, sekolah, AppSekolahRepository) {

            $scope.sekolah = sekolah;
            $scope._current = 1;
            $scope.evaluasi = {};
            $scope.prodi_current    = false;
            $scope.butir    = {};

            var _bagian,
                _instrumen,
                _group_id,
                _sources,
                _total;
            
            $scope.goEvaluasi = function(prodi) {
                if ($scope.prodi_current == false) {
                    $scope.prodi_current = parseInt(prodi);
                    $('.prodi-evaluasi').addClass('hide');
                    $('#prodi-'+prodi).removeClass('hide').addClass('active');   

                    // init source 
                    __init_group();
                    __init_source();

                } else {
                    $scope.prodi_current = false;
                    $scope._current = 1;
                    $scope.butir = {};
                    $('.prodi-evaluasi').removeClass('hide').removeClass('active');     
                }
            }

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
                _bagian     = TAFFY(INSTRUMEN.BAGIAN);
                _instrumen  = TAFFY(INSTRUMEN.BUTIR);

                _sources    =  _instrumen()
                                .join( _bagian({ group_id: { is: parseInt(_group_id.group_id) }}), ['bagian_id', 'id'])
                                .order('nomor');

                _total      = _sources.count();

                $scope.sources = _sources.get();
                $scope.total   = _total;

                __source_initialize($scope.sources, $scope._current);
            }

            var __source_initialize = function(data, current) {
                $scope.butir = data[current - 1];
            }

            $scope.$watch('_current', function() {
                if (parseInt($scope._current) > 0 && parseInt($scope._current) < _total) {
                    __source_initialize($scope.sources, $scope._current);
                }
            });

            $scope.next = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (_total > parseInt($scope._current)) {
                    $scope._current = parseInt($scope._current) + 1;
                    insertUpdate();
                } else {
                    alert('Soal telah habis');
                }
            }


            $scope.prev = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (parseInt($scope._current) > 1) {
                    $scope._current = parseInt($scope._current) - 1;
                    insertUpdate();
                } else {
                    alert('Tidak bisa melakukan prev');
                }
            }

            var insertUpdate = function () {
                var _data = $scope.butir,
                    _jawaban = parseInt($scope.evaluasi.id),
                    _sekolah = sekolah,
                    _evaluasi = {};

                _evaluasi.id        = _data.id;
                _evaluasi.prodi_id  = $scope.prodi_current;
                _evaluasi.bagian_id = _data.right_id;
                _evaluasi.nomor     = _data.nomor;
                _evaluasi.jawaban   = _jawaban;
                _evaluasi.hasil     = _jawaban * _data.bobot;

                if (sekolah.evaluasi == undefined) {
                    sekolah.evaluasi = [];
                }

                var db = TAFFY(sekolah.evaluasi);
                var soal = db({nomor: { is: parseInt(_evaluasi.nomor)}});

                // insert or update data evaluasi
                if (soal.first()) {
                    soal.update(_evaluasi);
                } else {
                    db.insert(_evaluasi);   
                }

                sekolah.evaluasi = db().get();
                AppSekolahRepository.update(sekolah);
                
            }

            /*
            

            var sources = function() {
                $scope.butir = _sources.get()[$scope._current - 1];
            }

            // init
            // ------------------------------------------------------
            sources();
            

            $scope.$watch('_current', function() {
                if (parseInt($scope._current) > 0 && parseInt($scope._current) < _total) {
                    sources();
                }
                
            });

            $scope.next = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (_total > parseInt($scope._current)) {
                    $scope._current = parseInt($scope._current) + 1;
                    insertUpdate();
                } else {
                    alert('Soal telah habis');
                }
            }

            $scope.prev = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (parseInt($scope._current) > 1) {
                    $scope._current = parseInt($scope._current) - 1;
                    insertUpdate();
                } else {
                    alert('Tidak bisa melakukan prev');
                }
            }

            var insertUpdate = function () {
                var _data = $scope.butir,
                    _jawaban = parseInt($scope.evaluasi.id),
                    _sekolah = sekolah,
                    _evaluasi = {};

                _evaluasi.id = _data.id;
                _evaluasi.nomor = _data.nomor;
                _evaluasi.jawaban = _jawaban;
                _evaluasi.hasil = _jawaban * _data.bobot;

                console.log(_evaluasi);
            } */
        })
    
        .controller('AppSekolahIsiEvaluasiCtrl', function($scope, sekolah, AppSekolahRepository) {


            


        })

})();