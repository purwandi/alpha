/**
 * Get group id
 *
 * @param  int jenjang
 * @return int
 */
var getGroupIdJenjang = function(jenjang) {
    var _data = TAFFY(APP.JENJANG);

    return _data({
        id: {
            is: parseInt(jenjang)
        }
    }).first();

};

/**
 * Find index by key value
 *
 * @link   http://debugmode.net/2013/02/19/how-to-find-index-of-an-item-in-javascript-object-array/
 * @param  array arrays
 * @param  string key
 * @param  string value
 * @return int
 */
var findIndexByKeyValue = function (arrays, key, value) {
    for (var i = 0; i < arrays.length; i++) {
        if (arrays[i][key] == value) {
            return i;
        }
    }
    return null;
};

/**
 * Round 2 digits
 *
 * @param  numeric num
 * @return numeric
 */
var roundDecimal = function(num) {
    return parseFloat(num).toFixed(2);
};

/**
 * Get kelayakan
 *
 * @param  numeric nilai
 * @return string:L|T
 */
var getLayak = function(nilai) {
    if (nilai >= 56) {
        return 'L';
    } else {
        return 'T';
    }
};

/**
 * Get peringkat hasil akreditasi
 *
 * @param  numeric nilai
 * @return string
 */
var getPeringkat = function(nilai) {
    if (nilai > 85 && nilai <= 100) {
        return 'A';
    } else if (nilai > 70 && nilai <=85 ) {
        return 'B';
    } else if(nilai > 55 && nilai <= 70) {
        return 'C';
    } else {
        return 'TT';
    }
};

/**
 * Get hasil akreditasi
 *
 * @param  numeric nilai
 * @param  int jenjang_id
 * @return numeric
 */
var getHasil = function(nilai, jenjang_id) {
    if (jenjang_id == 16) {
        return nilai;
    } else if (jenjang_id == 17) {
        return nilai;
    } else {
        return Math.round(nilai);
    }
};