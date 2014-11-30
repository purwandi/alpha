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

    .factory('storage', function($q, localStore, chromeStore) {
      var driver;
      var deferred = $q;

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

    .factory('localStore', function($q) {
      
      var deferred = $q.defer();

      return {
        init: function(key) {

        },
        set: function(key, value) {
          value = store.serialize(value);
          return localStorage.setItem(key, value);
        },
        get: function(key) {
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

    .factory('chromeStore', function($q) {

      var deferred = $q.defer();

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