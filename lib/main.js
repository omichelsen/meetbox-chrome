var io = require('socket.io-client');
var Sonic = require('sonicnet.js');

var ALPHABET = '01eilno';
var MESSAGE = '0lenin';

var sender, listener;

function send() {
    var ssocket = new Sonic.SonicSocket({alphabet: ALPHABET, charDuration: 0.2});
    ssocket.send(MESSAGE);
    console.log('sending', MESSAGE);
}

function start() {
    console.log('start interval');
    send();
    sender = setInterval(send, 1000 * 30);
    listen();
}

function stop() {
    console.log('stop interval');
    clearInterval(sender);
    listener.stop();
}

function listen() {
    listener = new Sonic.SonicServer({alphabet: ALPHABET});
    listener.on('message', function(message) {
        console.log('message', message);
        if (/1[elno]+/i.test(message)) {
            // var sessionUrl = 'https://next.g2m.me/' + message.substr(1);
            var sessionUrl = 'https://dev.g2m.me:8243/' + message.substr(1);
            console.log('joining', sessionUrl);
            join(sessionUrl);
        }
    });
    listener.start();
    console.log('listening', ALPHABET);
}

var tabId;

function join(sessionUrl) {
    // stop broadcasting and listening
    stop();

    // start session in new tab
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
        start();
    });
}

start();

setTimeout(function () {

    chrome.runtime.sendMessage({url: 'https://next.g2m.me/lenin'}, function(response) {
        // console.log(response.farewell);
        console.log('event msg response', response);
    });

}, 3000);

// var socket = io.connect('http://meetbox.ngrok.io');
// socket.on('join/LENNON', function (data) {
//     console.log('socket rocket', data);
//     join(data.url);
// });

