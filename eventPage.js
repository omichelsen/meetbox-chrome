var currentSessionUrl;

chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({
		'url': 'chrome://newtab'
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	if (sender.tab && request.url) {
		chrome.tabs.update(sender.tab.id, request, function (tab) {
			console.log('event page update done', tab);
		});
	}
});

// Inject content script for GoToMeeting Free
chrome.webNavigation.onCompleted.addListener(function (details) {
	console.log('webNavigation-free completed', details);
	chrome.tabs.executeScript(details.tabId, {
		file: 'content-free.js'
	});
}, {url: [{hostContains: 'g2m.me'}]});

// Inject content script for GoToMeeting Pro
chrome.webNavigation.onCompleted.addListener(function (details) {
	console.log('webNavigation-free completed', details);
	chrome.tabs.executeScript(details.tabId, {
		file: 'content-pro.js'
	});
}, {url: [{hostContains: 'gotomeeting.com'}]});