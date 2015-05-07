var Sonic = require('sonicnet.js');

var ALPHABET = '01eilno';
var MESSAGE = '0lenin';

var sender, listener;

function send() {
    console.log('ultraserver send', MESSAGE);
    var ssocket = new Sonic.SonicSocket({alphabet: ALPHABET, charDuration: 0.2});
    ssocket.send(MESSAGE);
}

function listen(callback) {
    console.log('ultraserver listen', ALPHABET);
    listener = new Sonic.SonicServer({alphabet: ALPHABET});
    listener.on('message', function(message) {
        console.log('ultraserver message', message);
        if (/1[elno]+/i.test(message)) {
            // var host = 'https://next.g2m.me/';
            var host = 'https://dev.g2m.me:8243/';
            var sessionUrl = host + message.substr(1);
            console.log('ultraserver callback', sessionUrl);
            callback(sessionUrl);
        }
    });
    listener.start();
}

function start(callback) {
    console.log('ultraserver start');
    send();
    sender = setInterval(send, 1000 * 30);
    listen(callback);
}

function stop() {
    console.log('ultraserver stop');
    clearInterval(sender);
    listener.stop();
}

module.exports = {
    start: start,
    stop: stop
};