console.log('content-free.js loaded', window.location.href);

var sessionUrl = window.location.href;

setInterval(function () {
	console.log('content-free.js watch url', window.location.href);
	if (sessionUrl !== window.location.href) {
		console.log('content-free.js redirecting');
		chrome.runtime.sendMessage({url: 'chrome://newtab'}, function(response) {
		    console.log('event msg response', response);
		});
	}
}, 3000);
