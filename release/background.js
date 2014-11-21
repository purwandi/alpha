/* chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {

  }, function(createWindow) {
    createWindow.maximize();
  });
});
*/


chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'bounds': {
      'width': 1000,
      'height': 700
    }
  });
});