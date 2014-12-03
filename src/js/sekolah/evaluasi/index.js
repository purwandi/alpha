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

            var _source_bagian,
                _bagian,
                _source_instrumen,
                _group_id,
                _sources,
                _total;
            
            $scope.goEvaluasi = function(prodi) {
                if ($scope.prodi_current == false) {
                    $scope.prodi_current = parseInt(prodi);
                    $('.prodi-evaluasi').addClass('hide');
                    $('#prodi-'+prodi).removeClass('hide');   

                    // init source 
                    __init_group();
                    __init_source();

                } else {
                    $scope.prodi_current = false;
                    $scope._current = 1;
                    $scope.butir = {};
                    $('.prodi-evaluasi').removeClass('hide');     
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
                _source_bagian     = TAFFY(INSTRUMEN.BAGIAN);
                _source_instrumen  = TAFFY(INSTRUMEN.BUTIR);
                _bagian            = _source_bagian({ group_id: { is: parseInt(_group_id.group_id) }});

                _sources    =  _source_instrumen()
                                .join( _bagian, ['bagian_id', 'id'])
                                .order('nomor');

                _total      = _sources.count();

                $scope.sources = _sources.get();
                $scope.total   = _total;

                __source_initialize($scope.sources, $scope._current);
            }

            var __source_initialize = function(data, current) {
                // console.log(current);
                $scope.butir = data[current - 1];
                // console.log(data);
            }

            $scope.$watch('_current', function() {
                if (parseInt($scope._current) > 0 && parseInt($scope._current) <= _total) {
                    __source_initialize($scope.sources, $scope._current);
                }
            });

            $scope.next = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (_total > parseInt($scope._current)) {
                    $scope._current = parseInt($scope._current) + 1;
                } else {
                    alert('Soal telah habis');
                }

                insertUpdate();
            }


            $scope.prev = function(current) {
                if ($scope.evaluasi.id == undefined) {
                    return alert('Please select');
                }

                if (parseInt($scope._current) > 1) {
                    $scope._current = parseInt($scope._current) - 1;
                } else {
                    alert('Tidak bisa melakukan prev');
                }

                insertUpdate();
            }

            var insertUpdate = function () {
                var _data       = $scope.butir,
                    _jawaban    = parseInt($scope.evaluasi.id),
                    _index      = findIndexByKeyValue(sekolah.program, 'id', $scope.prodi_current),
                    _program    = sekolah.program[_index],
                    _evaluasi   = {};

                _evaluasi.id        = _data.id;
                _evaluasi.prodi_id  = $scope.prodi_current;
                _evaluasi.bagian_id = _data.right_id;
                _evaluasi.nomor     = _data.nomor;
                _evaluasi.jawaban   = _jawaban;
                _evaluasi.hasil     = _jawaban * _data.bobot;

                // console.log(sekolah.program[_index]);

                if (_program.butir == undefined) {
                    _program.butir = [];
                }

                var db = TAFFY(_program.butir);
                var soal = db({nomor: { is: parseInt(_evaluasi.nomor)}});

                // insert or update data evaluasi
                if (soal.first()) {
                    soal.update(_evaluasi);
                } else {
                    db.insert(_evaluasi);   
                }

                _program.butir = db().get();
                AppSekolahRepository.update(sekolah);

                // Calculator
                App.Calculator.init(db, _group_id.group_id, $scope.prodi_current);
                // console.log(App.Calculator.komponen);
                // console.log(App.Calculator.hasil);
            }
        })
    
        .controller('AppSekolahIsiEvaluasiCtrl', function($scope, sekolah, AppSekolahRepository) {


            


        })

})();