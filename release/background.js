chrome.app.runtime.onLaunched.addListener(function() {

  	chrome.app.window.create('index.html', {
  		id: "mainwin",
    	innerBounds: {
      		top: 128,
      		left: 128,
      		minWidth: 1000,
      		minHeight: 700
    	}, 
    	// frame: 'none'
  	});
});