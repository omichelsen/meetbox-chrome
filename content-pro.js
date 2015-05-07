console.log('content-pro.js loaded', window.location.href);

var sessionUrl = window.location.href;

setTimeout(function () {
	console.log('content-pro.js setting name', location.hash);
	var elmJoinName = document.getElementById('join-name'),
		elmJoinSubmit = document.getElementById('join-submit');
	if (elmJoinName && elmJoinSubmit && location.hash) {
		elmJoinName.value = decodeURIComponent(location.hash.substr(1));

		var e = document.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elmJoinName.dispatchEvent(e);

		setTimeout(function () {
			elmJoinSubmit.click();
		}, 500);
	}
}, 3000);


setInterval(function () {
	console.log('content-pro.js watch url', window.location.href);
	if (sessionUrl !== window.location.href) {
		console.log('content-pro.js redirecting');
		chrome.runtime.sendMessage({url: 'chrome://newtab'}, function(response) {
			console.log('event msg response', response);
		});
	}
}, 3000);
