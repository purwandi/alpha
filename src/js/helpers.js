
/**
 * 
 */
var getGroupIdJenjang = function(jenjang) {
    var _data = TAFFY(APP.JENJANG);

    return _data({
        id: {
            is: parseInt(jenjang)
        }
    }).first();

};