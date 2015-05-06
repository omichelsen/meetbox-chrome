var Sonic = require('../node_modules/sonicnet.js/lib/main');

var ALPHABET = '01elno';
var MESSAGE = '0lennon';

var ticker;

function send() {
    var ssocket = new Sonic.SonicSocket({alphabet: ALPHABET, charDuration: 0.2});
    ssocket.send(MESSAGE);
    console.log('sending', MESSAGE);
}

function start() {
	console.log('start interval');
	send();
    ticker = setInterval(send, 1000 * 5);
}

function stop() {
	console.log('stop interval');
    clearInterval(ticker);
}

function listen() {
    var sserver = new Sonic.SonicServer({alphabet: ALPHABET});
    sserver.on('message', function(message) {
        console.log('message', message);
        if (/1[elno]+/i.test(message)) {
	        var sessionUrl = 'https://next.g2m.me/' + message.substr(1);
	        console.log('joining', sessionUrl);
        	join(sessionUrl);
        }
    });
    sserver.start();
    console.log('listening', ALPHABET);
}

var tabId;

function join(sessionUrl) {
	sessionUrl = sessionUrl || 'https://next.g2m.me/lennon';
	chrome.tabs.create({url: sessionUrl}, function (tab) {
		console.log('tab details', tab);
		tabId = tab.id;
	});

	chrome.tabs.onUpdated.addListener(function (id, info, tab) {
		// Only react to tabs we have created (url sometimes changes to undefined so only listen for real URLs)
		if (tabId === id && info.url && info.url !== sessionUrl) {
			console.log('url changed to', info.url);
			chrome.tabs.onUpdated.removeListener();
			leave();
		}
	});
}

function leave() {
	chrome.tabs.remove(tabId, function () {
		console.log('tab closed');
	});
}

var btnStart = document.getElementById('start');
btnStart.addEventListener('click', start);

var btnJoin = document.getElementById('join');
btnJoin.addEventListener('click', join);
