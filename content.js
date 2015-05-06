
setTimeout(function () {

    chrome.runtime.sendMessage({url: 'chrome://newtab'}, function(response) {
        console.log('event msg response', response);
    });

}, 3000);
