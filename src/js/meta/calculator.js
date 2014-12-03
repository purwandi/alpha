var App = App || {};
App.Calculator = App.Calculator || {};

App.Calculator = (function() {

    var _APP,
        
        __komponen   = [],
        __hasil      = {}

    /**
     * Bootstrap the library
     * 
     * @param  object db       The taffy db object butir jawaban
     * @param  int    group_id Group id satuan pendidikan
     * @param  int    prodi_id Current prodi id
     * @return void
     */
    function bootstrap(db, group_id, prodi_id) {
        var _source_bagian     = TAFFY(INSTRUMEN.BAGIAN);
        var _bagian            = _source_bagian({ group_id: { is: parseInt(group_id) }});

        var __nilai         = 0,
            __tidakLayak    = 0,
            __nilaiKomp40   = 0;

        _bagian.each(function (record,recordnumber) {
            var skor  = db({bagian_id: {is: record.id}}).sum('hasil');
            var nilai = roundDecimal((skor/record.skormaks) * record.bobot);
            var ratusan = roundDecimal((skor/record.skormaks) * 100);
            var layak  = getLayak(ratusan);                    

            __komponen.push({
                id      : record.id,
                prodi_id: prodi_id,
                skor    : skor,
                nilai   : nilai,
                ratusan : ratusan,
                layak   : layak
            });

            __nilai = parseInt(__nilai) + parseInt(nilai);
            if (ratusan < 40) {
                __nilaiKomp40 = 1;
            }
            if (layak != 'L') {
                __tidakLayak = parseInt(__tidakLayak) + 1;
            }
        });  

        // console.log(__komponen);    

        if (__nilai <= 55 || __tidakLayak > 2 || __nilaiKomp40 == 1) {
            // console.log('Peringkat TT');
            __hasil.peringkat = 'TT';
        } else {
            // console.log(__nilai);
            // console.log(getPeringkat(__nilai));
            __hasil.peringkat = getPeringkat(__nilai);
        }

        __hasil.nilai = __nilai;
    }


    _APP = {
        init: bootstrap,
        komponen: __komponen,
        hasil: __hasil
    }

    return _APP;
})();