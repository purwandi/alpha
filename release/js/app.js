var Env   = {};
Env.API_URL        = 'http://api.bap-sm.lo';
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
            AppSekolahRepository.update(value);
        }


        // -----------------------------------------------------------------------
        // STEP
        // -----------------------------------------------------------------------
        $scope.save = function() {
            return update($scope.sekolah);
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
                $('#prodi-'+prodi).removeClass('hide');
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

		$scope.goEvaluasi = function(prodi) {
			if ($scope.prodi_current == false) {
				$scope.prodi_current = parseInt(prodi);
				$('.prodi-evaluasi').addClass('hide');
                $('#prodi-'+prodi).removeClass('hide');   
				

				var _index      = findIndexByKeyValue(sekolah.program, 'id', $scope.prodi_current);
            	var _program    = sekolah.program[_index];
            	$scope.program  = _program;

			} else {
				$scope.prodi_current = false;
				$scope.butir 	= {};
				$scope.program 	= {};
				$('.prodi-evaluasi').removeClass('hide');     
			}
		}
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
                }

            })
            .setDefaultMsg({
                digit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                },
                maxdigit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                },
                mindigit: {
                    error: 'Number should between 5 ~ 10',
                    success: 'good'
                }
            });

    }

})();