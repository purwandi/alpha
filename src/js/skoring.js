var App = App || {};
App.Skoring = App.Skoring || {};

App.Skoring = ( function() {

    var _APP;
    var __komponen;
    var __hasil = {};

    /**
     * Bootstrap the library
     *
     * @param  object db       The taffy db object butir jawaban
     * @params object komponen
     * @param  int    group_id Group id satuan pendidikan
     * @param  int    prodi_id Current prodi id
     * @return void
     */
    function bootstrap(db, komponen, group_id, prodi_id) {

        __komponen = TAFFY(komponen);

        var _source_bagian = TAFFY(INSTRUMEN.BAGIAN);
        var _bagian = _source_bagian({
            group_id: {
                is: parseInt(group_id)
            }
        });

        var __nilai = 0;
        var __tidakLayak = 0;
        var __nilaiKomp40 = 0;

        var nomor = 1;

        _bagian.each(function(record, recordnumber) {
            var butir = db({
                bagian_id: {
                    is: record.id
                }
            });

            var skor = 0;

            butir.each(function(key) {
                skor = skor + key.evaluasi.hasil;
            });

            var nilai = roundDecimal((skor / record.skormaks) * record.bobot);
            var ratusan = roundDecimal((skor / record.skormaks) * 100);
            var layak = getLayak(ratusan);

            var komponen_data = {
                id: record.id,
                prodi_id: prodi_id,
                skor: skor,
                nilai: nilai,
                ratusan: ratusan,
                layak: layak,
                nomor: nomor,
                komponen: record
            };

            nomor = nomor + 1;

            var komponen = __komponen({
                id: {
                    is: parseInt(record.id)
                }
            });

            // insert or update data evaluasi
            if (komponen.first()) {
                komponen.update(komponen_data);
            } else {
                __komponen.insert(komponen_data);
            }

            __nilai = parseFloat(__nilai) + parseFloat(nilai);
            if (ratusan < 40) {
                __nilaiKomp40 = 1;
            }
            if (layak != 'L') {
                __tidakLayak = parseInt(__tidakLayak) + 1;
            }
        });

        __nilai = parseFloat(__nilai).toFixed(2);

        // Set hasil pengisian
        if (__nilai <= 55 || __tidakLayak > 2 || __nilaiKomp40 == 1) {
            __hasil.peringkat = 'TT';
        } else {
            __hasil.peringkat = getPeringkat(__nilai);
        }

        __hasil.nilai = __nilai;
    }

    function hasilKomponen() {
        return __komponen().get();
    }

    function hasilNilai() {
        return __hasil;
    }


    _APP = {
        init: bootstrap,
        komponen: hasilKomponen,
        hasil: hasilNilai
    }

    return _APP;
} )();

App.Visitasi = ( function() {

    var _static;
    var __hasil = {};

    function init(bagian, butir, komponen) {

        var _bagian = bagian;
        var komp = TAFFY(bagian);

        var __nilai = 0;
        var __tidakLayak = 0;
        var __nilaiKomp40 = 0;

        _bagian.each(function(entry) {

            var instrumen = butir({
                bagian_id: entry.id
            });

            var skor = 0;
            instrumen.each(function(bulir) {
                skor = skor + bulir.visitasi.hasil;
            });

            var nilai = roundDecimal((skor / entry.skormaks) * entry.bobot);
            var ratusan = roundDecimal((skor / entry.skormaks) * 100);
            var layak = getLayak(ratusan);

            var current_komponent = komponen({
                komponen_id: parseInt(entry.id)
            }).first();

            var komponen_data = current_komponent;
            komponen_data.visitasi.skor = skor;
            komponen_data.visitasi.nilai = nilai;
            komponen_data.visitasi.nilai_ratusan = ratusan;
            komponen_data.visitasi.kelayakan = layak;

            if (komponen_data.instrumen == undefined) {
                komponen_data.instrumen = entry;
            }

            komponen({
                komponen_id: parseInt(entry.id)
            }).update(komponen_data);

            __nilai = parseFloat(__nilai) + parseFloat(nilai);
            if (ratusan < 40) {
                __nilaiKomp40 = 1;
            }
            if (layak != 'L') {
                __tidakLayak = parseInt(__tidakLayak) + 1;
            }
        });

        __nilai = parseFloat(__nilai).toFixed(2);

        // Set hasil pengisian
        if (__nilai <= 55 || __tidakLayak > 2 || __nilaiKomp40 == 1) {
            __hasil.peringkat = 'TT';
            __hasil.peringkat_akhir = 'TT';
        } else {
            __hasil.peringkat = getPeringkat(__nilai);
            __hasil.peringkat_akhir = getPeringkat(Math.round(__nilai));
        }

        __hasil.nilai = __nilai;
        __hasil.nilai_akhir = Math.round(__nilai);
    }

    function hasil() {
        return __hasil;
    }

    _static = {
        init: init,
        hasil: hasil
    }

    return _static;

} )();

App.Prepare = ( function() {

    var program;
    var db;

    function init(db) {

        program = db.program;

        program.forEach(function(entry) {
            entry.butir.forEach(function(butir) {
                delete butir['instrumen'];
                delete butir['___id'];
                delete butir['___s'];
            });

            entry.komponen.forEach(function(komponen) {
                delete komponen['komponen'];
                delete komponen['___id'];
                delete komponen['___s'];
            });
        });

        return db;
    }

    return {
        init: init
    }
} )();