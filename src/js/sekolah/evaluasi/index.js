(function() {
    angular
        .module('app.sekolah.evaluasi', [])

        /* @ngInject */
        .controller('AppSekolahEvaluasiCtrl', function($scope, sekolah, AppSekolahRepository) {

            var _bagian = TAFFY(INSTRUMEN.BAGIAN),
                _instrumen = TAFFY(INSTRUMEN.BUTIR)
                _group_id = getGroupIdJenjang(sekolah.jenjang_id);

            var _sources = _instrumen()
                .join( _bagian({
                    group_id: {
                        is: parseInt(_group_id.group_id)
                    }
                }), ['bagian_id', 'id'])
                .order('nomor');

            var _total   = _sources.count();
            
            $scope._current = 1;
            $scope.evaluasi = {};


            var sources = function() {
                $scope.butir = (_sources.get()[$scope._current - 1]);
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
            }

            // console.log(_group_id);
            // console.log(_sources.count());

            //console.log(_instrumen().order('nama').get());


        })

})();