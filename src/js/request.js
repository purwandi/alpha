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
        var baseUrl   = 'http://api.bap-sm.lo',
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