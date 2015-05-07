console.log('content-pro.js loaded', window.location.href);

var sessionUrl = window.location.href;

setInterval(function () {
	console.log('content-pro.js watch url', window.location.href);
	if (sessionUrl !== window.location.href) {
		console.log('content-pro.js redirecting');
		chrome.runtime.sendMessage({url: 'chrome://newtab'}, function(response) {
		    console.log('event msg response', response);
		});
	}
}, 3000);
