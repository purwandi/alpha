/**
 * Storage Library 
 * https://github.com/humphreybc/super-simple-tasks/blob/master/public/js/app.js
 */

var ChromeStorage, DB, LocalStorage, store = {};

DB = (function() {
  function DB() {}

  DB.db_key = 'todo';

  return DB;

})();

// store 
store.serialize = function(value) {
  return JSON.stringify(value)
}

store.deserialize = function(value) {
  if (typeof value != 'string') { return undefined }
  try { return JSON.parse(value) }
  catch(e) { return value || undefined }
}

LocalStorage = (function() {
  function LocalStorage() {}

  LocalStorage.get = function(key, callback) {
    var value;
    value = localStorage.getItem(key);
    value = store.deserialize(value);
    return callback(value);
  };

  LocalStorage.getSync = function(key) {
    var value;
    value = localStorage.getItem(key);
    return store.deserialize(value);
  };

  LocalStorage.set = function(key, value) {
    value = store.serialize(value);
    return localStorage.setItem(key, value);
  };

  LocalStorage.remove = function(key) {
    return localStorage.removeItem(key);
  };

  LocalStorage.forEach = function(callback) {
    for (var i=0; i<localStorage.length; i++) {
      var key = localStorage.key(i);
      callback(key, LocalStorage.get(key));
    }
  };

  LocalStorage.getAll = function() {
    var ret = {};
    LocalStorage.forEach(function(key, val) {
      ret[key] = val;
    });
    return ret;
  }

  return LocalStorage;

})();

ChromeStorage = (function() {
  function ChromeStorage() {}

  ChromeStorage.get = function(key, callback) {
    return chrome.storage.sync.get(key, function(value) {
      value = value[key] || null || LocalStorage.getSync(key);
      return callback(store.deserialize(value));
    });
  };

  ChromeStorage.set = function(key, value, callback) {

    if (value === undefined) { return ChromeStorage.remove(key) }

    var params;
    params = {};
    params[key] = store.serialize(value);
    return chrome.storage.sync.set(params, function() {});
  };

  ChromeStorage.remove = function(key) {
    return chrome.storage.sync.remove(key, function() {});
  };

  if (!!window.chrome && chrome.storage) {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      var key, storageChange, _results;
      _results = [];
      for (key in changes) {
        if (key === DB.db_key) {
          storageChange = changes[key];
          _results.push(Views.showTasks(storageChange.newValue));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  }

  return ChromeStorage;

})();