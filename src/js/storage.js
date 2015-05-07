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