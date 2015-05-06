chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({
		'url': 'chrome://newtab'
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
	if (sender.tab && request.url) {
		chrome.tabs.update(sender.tab.id, request);
	}
});

chrome.webNavigation.onCompleted.addListener(function (details) {
	console.log('webNavigation completed', details);
	chrome.tabs.executeScript(details.tabId, {
		// code: 'document.body.style.backgroundColor="red"'
		file: 'content.js'
	});
});