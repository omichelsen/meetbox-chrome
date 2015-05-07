console.log('content-pro.js loaded', window.location.href);

// Insert name from hash
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

// Leave if end dialog is shown
setInterval(function () {
	console.log('content-pro.js watch url', window.location.href);
	var elmLeaveBtn = document.getElementById('button-leave-meeting');
	if (elmLeaveBtn) {
		console.log('content-pro.js redirecting');
		chrome.runtime.sendMessage({url: 'chrome://newtab'}, function(response) {
			console.log('event msg response', response);
		});
	}
}, 3000);
