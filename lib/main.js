var io = require('socket.io-client');
var moment = require('moment');
var ultraserver = require('./ultraserver');

function join(sessionUrl) {
    console.log('join', sessionUrl);

    // stop broadcasting and listening
    ultraserver.stop();

    // message the event page to start a session
    chrome.runtime.sendMessage({url: sessionUrl}, function(response) {
        console.log('event msg response', response);
    });
}

// ultraserver.start(join);

// setTimeout(function () {join('https://next.g2m.me/lenin')}, 5000);

// var socket = io.connect('http://meetbox.ngrok.io');
// socket.on('join/LENNON', function (data) {
//     console.log('socket rocket', data);
//     join(data.url);
// });


// UI
var elmTime = document.getElementById('time');
setInterval(function () {
    elmTime.textContent = moment(Date.now()).format('LT');
}, 1000);

var elmDefault = document.getElementById('state-default'),
    elmProximity = document.getElementById('state-proximity');
setInterval(function () {
    elmDefault.classList.toggle('hide');
    elmProximity.classList.toggle('hide');
}, 2000);
