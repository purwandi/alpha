var App = App || {};
App.Skoring = App.Skoring || {};

App.Skoring = (function() {

    var _APP,
        __komponen,
        __hasil      = {}

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

        var _source_bagian     = TAFFY(INSTRUMEN.BAGIAN);
        var _bagian            = _source_bagian({ group_id: { is: parseInt(group_id) }});

        var __nilai         = 0,
            __tidakLayak    = 0,
            __nilaiKomp40   = 0;

        var nomor           = 1;

        _bagian.each(function (record,recordnumber) {
            var butir    = db({ bagian_id: {is: record.id} });

            var skor = 0;

            butir.each(function(key) {
                skor = skor + key.evaluasi.hasil;
            });

            var nilai   = roundDecimal((skor/record.skormaks) * record.bobot);
            var ratusan = roundDecimal((skor/record.skormaks) * 100);
            var layak   = getLayak(ratusan);

            var komponen_data = {
                id      : record.id,
                prodi_id: prodi_id,
                skor    : skor,
                nilai   : nilai,
                ratusan : ratusan,
                layak   : layak,
                nomor   : nomor,
                komponen: record
            };

            nomor = nomor + 1;

            var komponen = __komponen({id: { is: parseInt(record.id)}});

            // insert or update data evaluasi
            if (komponen.first()) {
                komponen.update(komponen_data);
            } else {
                __komponen.insert(komponen_data);
            }

            //console.log(" Nilai kompo :" + nilai)
            //console.log(__nilai);

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
})();

App.Prepare = (function() {

    var program;
    var db;

    function init(db) {

        program = db.program;
        db.alamat_no        = parseInt(db.alamat_no);
        db.alamat_rt        = parseInt(db.alamat_rt);
        db.alamat_rw        = parseInt(db.alamat_rw);
        db.nomor_telepon    = parseInt(db.nomor_telepon);
        db.nomor_hp         = parseInt(db.nomor_hp);
        db.nomor_fax        = parseInt(db.nomor_fax);

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
})();