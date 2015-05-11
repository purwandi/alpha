var Env   = {};
Env.API_URL        = 'http://api.bap-sm.or.id';
Env.TIMEZONE        = [7, "WIB"];
$(document).ready(function() {

    if (!!window.chrome && chrome.storage) {
        console.log('Using chrome.storage.sync to save');
        window.storageType = 'ChromeStorage';
    } else {
        console.log('Using localStorage to save');
        window.storageType = 'LocalStorage';
    }

});

(function() {
    angular
        .module('app', [
            'ui.router',

            'app.directive.prodi',
            'app.directive.maxheight',
            'app.directive.affix',
            'app.app.directive.daerah',

            'templates',

            'app.base',
            'app.sekolah',
            'app.asesor'
        ])

        .config(function($locationProvider, $urlRouterProvider) {
            // $locationProvider.html5Mode(true);
            $urlRouterProvider
                .otherwise('/')
        })
}) ();

(function() {

    'use strict';

    angular
        .module('alert', [
            'ui.bootstrap.modal',
            'template/modal/backdrop.html',
            'template/modal/window.html',
        ])
        .factory('msgService', msgService);


    function msgService($modal) {

        var modal,
            compileMessages = compileMessages,
            openModal = openModal;

        return {
            modal: openModal,
            confirm: openConfirmModal,
            notif: openNotif
        }

        function compileMessages(messages) {
            var msg   = TAFFY();

            for (var index in messages) {
                msg.insert({
                  'key'    : index,
                  'value'  : messages[index][0]
                });
            }

            return msg().get();
        }

        function openConfirmModal() {
            modal = $modal.open({
                backdrop: 'static',
                templateUrl: '/templates/modal-confirm-content.html',
                /* @ngInject */
                controller: function($scope) {
                    $scope.close = function() {
                        modal.close();
                    }

                    $scope.ok = function() {

                    }
                }
            });
        }

        function openModal(title, messages, type) {
            modal = $modal.open({
                backdrop: 'static',
                templateUrl: '/templates/modal-error-content.html',
                /* @ngInject */
                controller: function($scope) {
                    $scope.title = title;
                    $scope.type = type;
                    $scope.messages = compileMessages(messages);
                    $scope.close = function() {
                        modal.close();
                    }
                }
            })
        }

        function openNotif(title, message, type) {
            var _template, _title;

            if (type === 'danger') {
                _template = '<div class="notify alert alert-danger fade in">';
            //_title = 'Oh snap! You got an error!';
            } else if (type === 'success') {
                _template = '<div class="notify alert alert-success fade in">';
            //_title = 'Great, you have successful!';
            } else if (type === 'info') {
                _template = '<div class="notify alert alert-info fade in">';
            //_title = 'Great, you have successful!';
            } else {
                _template = '<div class="notify alert alert-warning fade in">';
            //_title = 'Oh snap! You got an error!';
            }

            _template += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
            _template += '<strong>' + title + '</strong>';
            _template += '<hr class="message-inner-separator">';
            _template += '<div class="notify-content">';
            _template += message;
            _template += '</div>';
            _template += '</div>';

            $('.message-bar').prepend(_template);

            return setTimeout((function() {
                $('.message-bar .alert').last().fadeOut(1000);
                $('.message-bar .alert').last().remove();
            }), 3000);
        }
    }

})();
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
    } else if(nilai > 55 && nilai <= 40) {
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
(function(){
    'use strict';

    angular
        .module('service.request', [])
        .config(config)
        .factory('Request', Request);

    /* @ngInject */
    function config($httpProvider) {
        /* @ngInject */
        var logOutUser =  function($location, $q) {

            function success(response) {
                return response;
            }

            function error (response) {
                if (response.status == 401) {
                    return $location.path('/signin');
                }
                return $q.reject(response);
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push(logOutUser);
    }

    /* @ngInject */
    function Request($q, $http) {
        var baseUrl   = Env.API_URL,
            defaults  = {};

        $http.defaults.headers.common['Content-Type'] = 'application/json';

        return {
            get: getRequest,
            post: postRequest,
            put: putRequest,
            delete: delRequest,
            setHeader: setRequest
        };

        function getRequest(url, parameters) {
            var request = $http.get(prepareUri(url), parameters);
            return sendRequest(request);
        }

        function postRequest(url, data, parameters) {
            var data = angular.extend(defaults, data);
            var request = $http.post(prepareUri(url), data, parameters);
            return sendRequest(request);
        }

        function putRequest(url, data, parameters) {
            var data = angular.extend(defaults, data);
            var request = $http.put(prepareUri(url), data, parameters);
            return sendRequest(request);
        }

        function delRequest(url, parameters) {
            var request = $http.delete(prepareUri(url), parameters);
            return sendRequest(request);
        }

        function setRequest(key, val) {
            $http.defaults.headers.common[key] = val;
        }

        function sendRequest(request) {
            var deferred = $q.defer();
            $('body').addClass('app-loading');
            request
                .success(function(response) {
                    deferred.resolve(response);
                    setTimeout((function() {
                        $('body').removeClass('app-loading');
                    }), 1000);
                })
                .error(function(response) {
                    deferred.reject(response);
                    setTimeout((function() {
                        $('body').removeClass('app-loading');
                    }), 1000);
                })

            return deferred.promise;
        }

        function prepareUri(url) {
            //if (url.indexOf(window.location.href) > -1) {
            //    return url;
            //} else {
            return Env.API_URL + '/' + url;
            //}
        }
    }

})();
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

            __nilai = parseInt(__nilai) + parseInt(nilai);
            if (ratusan < 40) {
                __nilaiKomp40 = 1;
            }
            if (layak != 'L') {
                __tidakLayak = parseInt(__tidakLayak) + 1;
            }
        });

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
/**
 * Storage Library 
 * https://github.com/humphreybc/super-simple-tasks/blob/master/public/js/app.js
 */

// store
var store = {}; 
store.serialize = function(value) {
  return JSON.stringify(value)
};

store.deserialize = function(value) {
  if (typeof value != 'string') { return undefined }
  try { return JSON.parse(value) }
  catch(e) { return value || undefined }
};

(function() {
  angular
    .module('storage', [])

    /* @ngInject */
    .factory('storage', function(localStore, chromeStore) {
      var driver;

      if (window.storageType == 'ChromeStorage' ) {
        driver = chromeStore
      } else {
        driver = localStore;
      }

      return {
        init: function(key) {

        },
        set: function(key, value) {
          return driver.set(key, value);
        },
        get: function(key) {
          return driver.get(key);
        },
        remove: function(key) {
          return driver.remove(key);
        }
      }
    })

    /* @ngInject */
    .factory('localStore', function($q) {
      
      return {
        init: function(key) {

        },
        set: function(key, value) {
          value = store.serialize(value);
          return localStorage.setItem(key, value);
        },
        get: function(key) {
          var deferred = $q.defer();
          value = localStorage.getItem(key);
          value = store.deserialize(value);
          deferred.resolve(value);
          return deferred.promise;
        },
        remove: function(key) {
          return localStorage.removeItem(key);
        }
      }
    })

    /* @ngInject */
    .factory('chromeStore', function($q) {

      return {
        init: function(key) {

        },
        set: function(key, value) {
          if (value === undefined) { 
            return ChromeStorage.remove(key) 
          }
          var params = {};    
          params[key] = value;
          return chrome.storage.local.set(params, function() {});
        },
        get: function(key) {
          var deferred = $q.defer();
          chrome.storage.local.get(key, function(value) {
            value = value[key] || null;
            deferred.resolve(value);
          });
          return deferred.promise;
        },
        remove: function(key) {
          return chrome.storage.local.remove(key, function() {});
        }
      }
    });

})();
(function() {
    angular
        .module('app.directive.affix', [])

        .directive('affix', function() {
            return {
                restrict: 'A',
                tranclude: true,
                link: function(scope, element, attributes) {
                    $('.affix').affix({
					  	offset: {
					    	top: 100,
					    	bottom: 20
					  	}
					});
                }
            }
        });
})();



(function() {
    'use srict';

    angular
        .module('app.app.directive.daerah', [])
        .directive('daerahProvinsi', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var provinsi = TAFFY(DAERAH.PROVINSI);
                    var value = provinsi({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahKota', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var kota = TAFFY(DAERAH.KOTA);
                    var value = kota({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahKecamatan', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var kecamatan = TAFFY(DAERAH.KECAMATAN);
                    var value = kecamatan({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
        .directive('daerahDesa', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var desa = TAFFY(DAERAH.DESA);
                    var value = desa({id : {is: parseInt(attrs.daerahId)}}).first();
                    element.text(value.nama);
                }
            }
        })
})();
(function() {
  angular
    .module('app.directive.datepicker', [])
    .directive('datePicker', function() {
      return {
        restrict: 'E',
        link: function(scope, element, attrs) {
          $(element).DateTimePicker();
        }
      }
    })
  })();
(function() {
    angular
        .module('app.directive.maxheight', [])

        .directive('maxHeight', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    //var winHeight = $(window).innerHeight();
                    //element.css('height', winHeight);

                    function setHeight() {
                        var windowHeight = $(window).innerHeight();
                        element.css('height', windowHeight);
                    };
                    
                    setHeight();

                    $(window).resize(function() {
                        setHeight();
                    });
                }
            }
        })
})();
(function() {
    angular
        .module('app.directive.prodi', [])

        .directive('prodi', function() {
            return {
                restrict: 'E',
                tranclude: true,
                link: function(scope, element, attrs) {
                    var prodi = TAFFY(APP.PRODI);

                    var value = prodi({id : {is: parseInt(attrs.prodid)}}).first();
                    element.text(value.nama);
                }
            }
        })
})();
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 10
   * @param errorCorrectLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = new Array();

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error('code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')');
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data) {
      var newData = qr8BitByte(data);
      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw new Error(row + ',' + col);
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createImgTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createImgTag(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytes = function(s) {
    var bytes = new Array();
    for (var i = 0; i < s.length; i += 1) {
      var c = s.charCodeAt(i);
      bytes.push(c & 0xff);
    }
    return bytes;
  };

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw new Error();
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw new Error(count + ' != ' + numChars);
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = new Array();
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw new Error('bad maskPattern:' + maskPattern);
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw new Error('mode:' + mode);
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw new Error('mode:' + mode);
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw new Error('mode:' + mode);
        }

      } else {
        throw new Error('type:' + type);
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw new Error('glog(' + n + ')');
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw new Error(num.length + '/' + shift);
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectLevel) {

      switch(errorCorrectLevel) {
      case QRErrorCorrectLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);

      if (typeof rsBlock == 'undefined') {
        throw new Error('bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectLevel:' + errorCorrectLevel);
      }

      var length = rsBlock.length / 3;

      var list = new Array();

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = new Array();
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = new Array();

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw new Error('n:' + n);
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw new Error('unexpected end of file./' + _buflen);
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw new Error('c:' + c);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw new Error('length over');
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw new Error('dup key:' + key);
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createImgTag = function(width, height, getPixel, alt) {

    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    var img = '';
    img += '<img';
    img += '\u0020src="';
    img += 'data:image/gif;base64,';
    img += base64;
    img += '"';
    img += '\u0020width="';
    img += width;
    img += '"';
    img += '\u0020height="';
    img += height;
    img += '"';
    if (alt) {
      img += '\u0020alt="';
      img += alt;
      img += '"';
    }
    img += '/>';

    return img;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript UTF8 Support (optional)
//
// Copyright (c) 2011 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

!function(qrcode) {

  //---------------------------------------------------------------------
  // overwrite qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytes = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}(qrcode);

/*
 * angular-qrcode v5.1.0
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.qrcode', [])
  .directive('qrcode', ['$window', function($window) {

    var canvas2D = !!$window.CanvasRenderingContext2D,
        levels = {
          'L': 'Low',
          'M': 'Medium',
          'Q': 'Quartile',
          'H': 'High'
        },
        draw = function(context, qr, modules, tile) {
          for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
              var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                  h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));

              context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
              context.fillRect(Math.round(col * tile),
                               Math.round(row * tile), w, h);
            }
          }
        };

    return {
      restrict: 'E',
      template: '<canvas class="qrcode"></canvas>',
      link: function(scope, element, attrs) {
        var domElement = element[0],
            $canvas = element.find('canvas'),
            canvas = $canvas[0],
            context = canvas2D ? canvas.getContext('2d') : null,
            download = 'download' in attrs,
            href = attrs.href,
            link = download || href ? document.createElement('a') : '',
            trim = /^\s+|\s+$/g,
            error,
            version,
            errorCorrectionLevel,
            data,
            size,
            modules,
            tile,
            qr,
            $img,
            setVersion = function(value) {
              version = Math.max(1, Math.min(parseInt(value, 10), 10)) || 4;
            },
            setErrorCorrectionLevel = function(value) {
              errorCorrectionLevel = value in levels ? value : 'M';
            },
            setData = function(value) {
              if (!value) {
                return;
              }

              data = value.replace(trim, '');
              qr = qrcode(version, errorCorrectionLevel);
              qr.addData(data);

              try {
                qr.make();
              } catch(e) {
                error = e.message;
                return;
              }

              error = false;
              modules = qr.getModuleCount();
            },
            setSize = function(value) {
              size = parseInt(value, 10) || modules * 2;
              tile = size / modules;
              canvas.width = canvas.height = size;
            },
            render = function() {
              if (!qr) {
                return;
              }

              if (error) {
                if (link) {
                  link.removeAttribute('download');
                  link.title = '';
                  link.href = '#_';
                }
                if (!canvas2D) {
                  domElement.innerHTML = '<img src width="' + size + '"' +
                                         'height="' + size + '"' +
                                         'class="qrcode">';
                }
                scope.$emit('qrcode:error', error);
                return;
              }

              if (download) {
                domElement.download = 'qrcode.png';
                domElement.title = 'Download QR code';
              }

              if (canvas2D) {
                draw(context, qr, modules, tile);

                if (download) {
                  domElement.href = canvas.toDataURL('image/png');
                  return;
                }
              } else {
                domElement.innerHTML = qr.createImgTag(tile, 0);
                $img = element.find('img');
                $img.addClass('qrcode');

                if (download) {
                  domElement.href = $img[0].src;
                  return;
                }
              }

              if (href) {
                domElement.href = href;
              }
            };

        if (link) {
          link.className = 'qrcode-link';
          $canvas.wrap(link);
          domElement = link;
        }

        setVersion(attrs.version);
        setErrorCorrectionLevel(attrs.errorCorrectionLevel);
        setSize(attrs.size);

        attrs.$observe('version', function(value) {
          if (!value) {
            return;
          }

          setVersion(value);
          setData(data);
          setSize(size);
          render();
        });

        attrs.$observe('errorCorrectionLevel', function(value) {
          if (!value) {
            return;
          }

          setErrorCorrectionLevel(value);
          setData(data);
          setSize(size);
          render();
        });

        attrs.$observe('data', function(value) {
          if (!value) {
            return;
          }

          setData(value);
          setSize(size);
          render();
        });

        attrs.$observe('size', function(value) {
          if (!value) {
            return;
          }

          setSize(value);
          render();
        });

        attrs.$observe('href', function(value) {
          if (!value) {
            return;
          }

          href = value;
          render();
        });
      }
    };
  }]);
(function() {
    'use strict';

    angular
        .module('upload', ['angularFileUpload', 'alert'])
        .directive('uploadFile', uploadFile);


    /* @ngInject */
    function uploadFile(FileUploader, msgService) {
        return {
            restrict: 'E',
            scope: { ngModel: '='},
            template: '<input type="file" nv-file-select uploader="uploader" /><input type="hidden" ng-model="ngModel">',
            compile: function() {
                return {
                    pre: function(scope, element, attrs) {
                        if (attrs.file == 'image') {
                            var url = Env.API_URL + '/upload/image';
                        } else {
                            var url = Env.API_URL + '/upload/docs';
                        }

                        scope.uploader = new FileUploader({
                            url: url,
                            autoUpload: true,
                            formData: [{
                                _token: Env.TOKEN
                            }],
                        });
                    },
                    // link
                    post: function(scope, element, attrs) {
                        var uploader = scope.uploader;
                        uploader.onSuccessItem = function(fileItem, response, status, headers) {
                            scope.$apply(function() {
                                scope.ngModel = response.url;
                            });
                        }

                        uploader.onErrorItem = function(fileItem, response, status, headers) {
                            msgService.modal(response.error.message, response.error.meta_message);
                        };

                        // /*{File|FileLikeObject}*/
                        /* uploader.onWhenAddingFileFailed = function(item , filter, options) {
                            console.info('onWhenAddingFileFailed', item, filter, options);
                        };
                        uploader.onAfterAddingFile = function(fileItem) {
                            console.info('onAfterAddingFile', fileItem);
                        };
                        uploader.onAfterAddingAll = function(addedFileItems) {
                            console.info('onAfterAddingAll', addedFileItems);
                        };
                        uploader.onBeforeUploadItem = function(item) {
                            console.info('onBeforeUploadItem', item);
                        };
                        uploader.onProgressItem = function(fileItem, progress) {
                            console.info('onProgressItem', fileItem, progress);
                        };
                        uploader.onProgressAll = function(progress) {
                            console.info('onProgressAll', progress);
                        };
                        uploader.onSuccessItem = function(fileItem, response, status, headers) {
                            console.info('onSuccessItem', fileItem, response, status, headers);
                        };
                        uploader.onErrorItem = function(fileItem, response, status, headers) {
                            console.info('onErrorItem', fileItem, response, status, headers);
                        };
                        uploader.onCancelItem = function(fileItem, response, status, headers) {
                            console.info('onCancelItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteItem = function(fileItem, response, status, headers) {
                            console.info('onCompleteItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteAll = function() {
                            console.info('onCompleteAll');
                        }; */

                        // console.log(2);
                        // console.log(scope.uploader);
                    }
                }
            }
        }
    }

})();
(function() {
    angular
        .module('app.base', [])
        .config(router)

    function router($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html'
            })
    }
})();
(function() {
	'use strict';

	angular
		.module('app.asesor', [
			'service.request',
			'storage'
		])
})();
(function() {
	'use strict';

	angular
		.module('app.asesor')
		.controller('AppAsesorIndexCtrl', AppAsesorIndexCtrl)
		.controller('AppAsesorBaseCtrl', AppAsesorBaseCtrl)
		.controller('AppAsesorVisitasiCtrl', AppAsesorVisitasiCtrl)

	function AppAsesorIndexCtrl($state, Request, storage) {
		var vm = this;
		vm.credentials = {};

		vm.verifikasi = verifikasi;

		function verifikasi() {
			return Request
				.post('visitasi/credentials', vm.credentials)
				.then(function(response) {
					storage.set('visitasi', response);
					$state.go('asesor.base');
				});
		}
	}

	function AppAsesorBaseCtrl(dataVisitasi) {
		var vm  = this;
		vm.data = dataVisitasi;
	}

	function AppAsesorVisitasiCtrl($stateParams, dataVisitasi) {
		var vm 			= this,
			visitasi 	= dataVisitasi,
			data 		= TAFFY(dataVisitasi.data),
			sekolah 	= data({ npsn: { is: $stateParams.npsn } }).first(),
			dataProdi 	= TAFFY(sekolah.data),
			prodi 		= dataProdi({ kode: {is: $stateParams.prodi } }).first();

		var _src_bagian,
			_bagian,
			_src_butir,
			_butir,
			_group_id;

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
			_src_bagian = TAFFY(INSTRUMEN.BAGIAN);
			_src_butir 	= TAFFY(INSTRUMEN.BUTIR);
			_bagian     = _src_bagian({ group_id: { is: parseInt(_group_id.group_id) }});
			_butir    	= _src_butir()
                          	.join( _bagian, ['bagian_id', 'id'])
                            .order('nomor');
		}

		var __kalkulasi = function() {
			console.log(vm.visitasi);
		}
		
		// Initialize data
		// ===============================================================
		__init_group();
		__init_source();

		// Setup View Model
		// ===============================================================
		vm.sekolah 	= sekolah;
		vm.prodi 	= prodi;
		vm.bagian   = _bagian.get();
		vm.butir    = _butir.get();

		// API's
		// ===============================================================
		vm.onSelectButir = onSelectButir;

		function onSelectButir() {
			__kalkulasi();
		}
		
	}
	
})();
(function() {
	'use strict';

	angular
		.module('app.asesor')
		.config(router)

	/* @ngInject */
	function router($stateProvider) {
		$stateProvider
			.state('asesor', {
				url: '/asesor',
				abstract: true,
				templateUrl: '/templates/asesor.html',
			})
			.state('asesor.home', {
				url: '',
				templateUrl: '/templates/asesor-index.html',
				controller: 'AppAsesorIndexCtrl',
				controllerAs: 'vm'
			})
			.state('asesor.base', {
				url: '/base',
				templateUrl: '/templates/asesor-base.html',
				controller: 'AppAsesorBaseCtrl',
				controllerAs: 'vm',
				resolve: {
					dataVisitasi: getDataRepository
				}
			})
			.state('asesor.visitasi', {
				url:'/visitasi/:npsn/:prodi',
				templateUrl: '/templates/asesor-visitasi.html',
				controller: 'AppAsesorVisitasiCtrl',
				controllerAs: 'vm',
				resolve: {
					dataVisitasi: getDataRepository
				}
			})
	}

	/* @ngInject */
	function getDataRepository(storage) {
		return storage.get('visitasi');
	}

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah', [
            'ui.bootstrap',
            'ui.bootstrap.tpls',

            'validation',
            'validation.rule',
            'app.directive.datepicker',
            'monospaced.qrcode',
            'upload',

            'app.sekolah.repository'
        ])

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .config(router)

    /* @ngInject */
    function router($stateProvider) {
        $stateProvider
            .state('sekolah', {
                url: '/sekolah',
                templateUrl: '/templates/sekolah.html',
            })
            .state('sekolah-home',  {
                url: '/sekolah/home',
                abstract: true,
                templateUrl: '/templates/sekolah-home.html'
            })

            .state('sekolah-home.index', {
                url: '/',
                templateUrl: '/templates/sekolah-home.index.html'
            })

            .state('sekolah-home.biodata', {
                url: '/biodata',
                controller: 'SekolahBiodataCtrl',
                templateUrl: '/templates/sekolah-home.biodata.html',
                resolve: {
                    sekolah: getSekolah
                }
            })

            .state('sekolah-home.instrumen', {
                url: '/instrumen',
                controller: 'SekolahInstrumenCtrl',
                templateUrl: '/templates/sekolah-home.instrumen.html',
                resolve: {
                    sekolah: getSekolah
                }
            })

            .state('sekolah-home.laporan', {
                url: '/laporan',
                controller: 'SekolahLaporanCtrl',
                templateUrl: '/templates/sekolah-home.laporan.html',
                resolve: {
                    sekolah: getSekolah
                }
            })
            .state('sekolah-home.pendaftaran', {
                url:'/pendaftaran',
                controller: 'SekolahPendaftaranCtrl',
                templateUrl: '/templates/sekolah-home.pendaftaran.html',
                resolve: {
                    sekolah: getSekolah
                }
            })
            .state('sekolah-home.cetak', {
                url:'/cetak',
                controller: 'SekolahCetakCtrl',
                templateUrl: '/templates/sekolah-home.cetak.html',
                resolve: {
                    sekolah: getSekolah
                }
            })


        function getSekolah(AppSekolahRepository) {
            return AppSekolahRepository.init();
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahBiodataCtrl', SekolahBiodataCtrl)
        .controller('SekolahBiodataProgramCtrl', SekolahBiodataProgramCtrl);


    function SekolahBiodataCtrl($scope, $modal, $injector, sekolah, AppSekolahRepository) {
        // var $scope = this;

        // Injector
        var $validationProvider = $injector.get('$validation');

        // $scope.sekolah = {};
        $scope.config = {
            jenjang: APP.JENJANG,
            status: APP.STATUS,
            wilayah: {
                provinsi: DAERAH.PROVINSI
            }
        }

        $scope.form_program = true;

        // init()
        // -----------------------------------------------------------------------
        AppSekolahRepository.sekolah = sekolah;
        $scope.sekolah = AppSekolahRepository.sekolah;
        $scope.success = false;
        $scope.error = false;

        if (sekolah == undefined) {
            $scope.sekolah = { program: [] };
        } else if (sekolah.program == undefined) {
            $scope.sekolah.program = [];
        }

        $scope.$watch(function() {
            return $scope.sekolah.jenjang_id;
        }, function(newValue, oldValue) {
            var _jenjang = parseInt($scope.sekolah.jenjang_id);

            if (oldValue != newValue) {
                $scope.sekolah.program = [];
            }

            if (_jenjang < 18) {
                $scope.sekolah.program = [{
                    id: 200
                }];
                $scope.form_program = true;
            } else {
                $scope.form_program = false;
                if ($scope.sekolah.program == undefined) {
                    $scope.sekolah.program = [];
                }
            }
        });


        var update = function(value) {
            $scope.success = true;
            AppSekolahRepository.update(value);
        }


        // -----------------------------------------------------------------------
        // STEP
        // -----------------------------------------------------------------------
        $scope.save = function() {
            $scope.success = true;
            return AppSekolahRepository.update($scope.sekolah);
        }


        // -----------------------------------------------------------------------
        // WILAYAH OPT
        // -----------------------------------------------------------------------
        //
        //
            $scope.$watch(function() {
                return $scope.sekolah.provinsi_id;
            }, function(oldValue, newValue) {
                var kota = TAFFY(DAERAH.KOTA),
                    provinsi = parseInt($scope.sekolah.provinsi_id);

                $scope.config.wilayah.kota = kota({provinsi_id:{is:provinsi}}).order('nama').get();
                $scope.config.wilayah.kecamatan = {};
                $scope.config.wilayah.desa = {};
            });

            $scope.$watch(function() {
                return $scope.sekolah.kota_id;
            }, function(oldValue, newValue) {
                var kecamatan = TAFFY(DAERAH.KECAMATAN),
                    kota = parseInt($scope.sekolah.kota_id);

                $scope.config.wilayah.kecamatan = kecamatan({kota_id:{is:kota}}).order('nama').get();
                $scope.config.wilayah.desa = {};
            });

            $scope.$watch(function() {
                return $scope.sekolah.kecamatan_id;
            }, function(oldValue, newValue) {
                var desa = TAFFY(DAERAH.DESA),
                    kecamatan = parseInt($scope.sekolah.kecamatan_id);

                $scope.config.wilayah.desa = desa({kecamatan_id:{is:kecamatan}}).order('nama').get();
            });

        // -----------------------------------------------------------------------
        // OPEN PROGRAM
        // -----------------------------------------------------------------------
            $scope.openProgram = function() {

                if ($scope.sekolah.jenjang_id != undefined) {
                    var modalInstance = $modal.open({
                        templateUrl: '/templates/sekolah-home.prodi.html',
                        controller: 'SekolahBiodataProgramCtrl',
                        scope: $scope
                    });

                    modalInstance.result.then(function(item) {
                        $scope.sekolah.program.push(item);
                        return update($scope.sekolah);
                    }, function(){
                        console.log('Modal dismiss at : '+new Date());
                    });
                } else {
                    return alert('Please select jenjang');
                }
            }

    }

    function SekolahBiodataProgramCtrl($scope, $modalInstance,  $injector) {
        var prodi       = TAFFY(APP.PRODI);
        var _sekolah    = $scope.sekolah;

        var $validationProvider = $injector.get('$validation');

        $scope.prodi = prodi({jenjang_id: {is:parseInt(_sekolah.jenjang_id)}}).order('nama').get();

        $scope.save = function() {
            $modalInstance.close($scope.program);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahInstrumenCtrl', SekolahInstrumenCtrl)

    function SekolahInstrumenCtrl($scope, $state, sekolah, AppSekolahRepository) {

        if ( ! sekolah) {
            $state.go('sekolah-home.biodata');
        }

        $scope.sekolah = sekolah;
        $scope.prodi_current = false;
        $scope.butir = {};
        $scope.jawaban = [];
        $scope.instrumen = {};
        $scope.program = {};

        var _source_bagian,
                _bagian,
                _source_instrumen,
                _group_id,
                _sources,
                _total,
                _index,
                _program;

        var DB_Butir;
        var DB_Komponen;

        $scope.goEvaluasi = function(prodi) {
            if ($scope.prodi_current == false) {
                $scope.prodi_current = parseInt(prodi);
                $('.prodi-evaluasi').addClass('hide');
                $('.prodi-'+prodi).removeClass('hide');
                /**
                 * Initialize
                 */
                __init_group();
                __init_source();

            } else {
                $scope.prodi_current = false;
                $scope.butir = {};
                $('.prodi-evaluasi').removeClass('hide');
            }
        }

        var __init_group = function() {
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

            _sources        =  _source_instrumen()
                                .join( _bagian, ['bagian_id', 'id'])
                                .order('nomor');

            _index          = findIndexByKeyValue(sekolah.program, 'id', $scope.prodi_current);
            _program        = sekolah.program[_index];


            // Initial Data Butir Instrumen
            // ------------------------------------------------
            if (_program.butir == undefined) {
                _program.butir = [];
            }

            if (_program.komponen == undefined) {
                _program.komponen = [];
            }

            DB_Butir = TAFFY(_program.butir);

            _sources.get().forEach(function(entry) {

                var instrumen    = DB_Butir({ nomor: { is: parseInt(entry.nomor) } });
                var data = {
                    id: entry.id,
                    bagian_id: entry.bagian_id,
                    nomor: entry.nomor,
                    instrumen: entry
                };

                if (instrumen.first()) {
                    instrumen.update(data);
                } else {
                    DB_Butir.insert(data);
                }
            });

            _program.butir  = DB_Butir().get();

            AppSekolahRepository.update(sekolah);

            _total          = _sources.count();

            $scope.sources  = _sources.get();
            $scope.total    = _total;
            $scope.program  = _program;
        }

        $scope.update = function() {

            App.Skoring.init(DB_Butir, $scope.program.komponen, _group_id.group_id, $scope.prodi_current);

            $scope.program.komponen = App.Skoring.komponen();
            $scope.program.hasil    = App.Skoring.hasil();

            AppSekolahRepository.update(sekolah);
        }

    }

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahLaporanCtrl', SekolahLaporanCtrl)


    function SekolahLaporanCtrl($scope, $state, sekolah) {


        if ( ! sekolah) {
            $state.go('sekolah-home.biodata');
        }

        $scope.sekolah = sekolah;
        $scope.program = {};
        $scope.prodi_current = false;
        $scope.biodata = false;

        $scope.goEvaluasi = function(prodi) {
            if ($scope.prodi_current == false) {

                if (prodi == 'biodata') {
                    $scope.biodata = true;
                }

                $scope.prodi_current = parseInt(prodi);
                $('.prodi-evaluasi').addClass('hide');
                $('.prodi-'+prodi).removeClass('hide');

                var _index      = findIndexByKeyValue(sekolah.program, 'id', $scope.prodi_current);
                var _program    = sekolah.program[_index];
                $scope.program  = _program;

            } else {
                if (prodi == 'biodata') {
                    $scope.biodata = false;
                }
                $scope.prodi_current = false;
                $scope.butir    = {};
                $scope.program  = {};
                $('.prodi-evaluasi').removeClass('hide');
            }
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .controller('SekolahPendaftaranCtrl', SekolahPendaftaranCtrl)
        .controller('SekolahCetakCtrl', SekolahCetakCtrl)


    function SekolahPendaftaranCtrl($scope, $state, $injector, AppSekolahRepository, sekolah, Request) {

        if ( ! sekolah) {
            $state.go('sekolah-home.biodata');
        }

        var $validationProvider = $injector.get('$validation');

        $scope.sekolah  = sekolah;
        $scope.error    = false;
        $scope.success  = false;

        $scope.data = {
            provinsi_id: sekolah.provinsi_id,
            jenjang_id: sekolah.jenjang_id,
            konten: sekolah,
            npsn: sekolah.npsn
        }

        $scope.pendaftaran = function() {
            Request.post('pengajuan', $scope.data)
                .then(function(response) {
                    $scope.success = true;
                    $scope.sekolah.kode = response.kode;
                    $scope.sekolah.created_at = response.created_at.date;

                    AppSekolahRepository.update($scope.sekolah);

                    console.log(response);
                }, function(error) {
                    $scope.error = true;
                    console.log(error);
                });
        }

    }

    function SekolahCetakCtrl($scope, sekolah) {
        $scope.sekolah = sekolah;
    }
})();
(function() {
    angular
        .module('app.sekolah.repository', ['storage'])

        /* @ngInject */
        .factory('AppSekolahRepository', function(storage) {
            
            var sekolah = {};
            
            return {
                sekolah: sekolah,
                init: function() {
                    return storage.get('sekolah');
                },
                update: function(value) {
                    return storage.set('sekolah', value);
                }
            }

        })
}) ();
(function() {
    'use strict';

    angular
        .module('app.sekolah')
        .config(validator);

    /* @ngInject */
    function validator($validationProvider) {

        // Base on
        // http://rickharrison.github.io/validate.js/validate.js

        /*
         * Define the regular expressions that will be used
         */
        var ruleRegex = /^(.+?)\[(.+)\]$/,
            numericRegex = /^[0-9]+$/,
            integerRegex = /^\-?[0-9]+$/,
            decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            alphaRegex = /^[a-z]+$/i,
            alphaNumericRegex = /^[a-z0-9]+$/i,
            alphaDashRegex = /^[a-z0-9_\-]+$/i,
            naturalRegex = /^[0-9]+$/i,
            naturalNoZeroRegex = /^[1-9][0-9]*$/i,
            ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
            base64Regex = /[^a-zA-Z0-9\/\+=]/i,
            numericDashRegex = /^[\d\-\s]+$/,
            urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

        $validationProvider
            .setExpression({
                digit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);
                    if ( ! value) {
                        return true;
                    }
                    else if (value && !numericRegex.test(length)) {
                        return false;
                    } else {
                        return value.length === parseInt(length, 10);
                    }


                },
                maxdigit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);
                    if (!numericRegex.test(length)) {
                        return false;
                    }

                    return value.length <= parseInt(length, 10)
                },
                mindigit: function(value, scope, element, attrs) {
                    var length = parseInt(attrs.length);

                    if (!numericRegex.test(length)) {
                        return false;
                    }

                    return value.length >= parseInt(length, 10)
                },
                alpha: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (alphaRegex.test(value));
                    }
                },
                alphanumeric: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (alphaNumericRegex.test(value));
                    }
                },
                alphadash: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (alphaDashRegex.test(value));
                    }
                },
                numeric: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (numericRegex.test(value));
                    }
                },
                integer: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (integerRegex.test(value));
                    }
                },
                decimal: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (decimalRegex.test(value));
                    }
                },
                isnatural: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (naturalRegex.test(value));
                    }
                },
                isnaturalnozero: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (naturalNoZeroRegex.test(value));
                    }
                },
                validip: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (ipRegex.test(value));
                    }
                },
                validurl: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return (urlRegex.test(value));
                    }
                },
                validemail: function(value, scope, element, attrs) {
                    if ( ! value) {
                        return true;
                    } else {
                        return emailRegex.test(value);
                    }
                }
            })
            .setDefaultMsg({
                digit: {
                    error: 'Number should between 5 ~ 10',
                    success: ''
                },
                maxdigit: {
                    error: 'Number should between 5 ~ 10',
                    success: ''
                },
                mindigit: {
                    error: 'Number should between 5 ~ 10',
                    success: ''
                },
                numeric: {
                    error: '',
                    success: ''
                },
                validemail: {
                    error: '',
                    success: ''
                }
            });

    }

})();