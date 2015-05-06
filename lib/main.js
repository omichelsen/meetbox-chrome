var SonicSocket = require('../node_modules/sonicnet.js/lib/sonic-socket.js');
var SonicServer = require('../node_modules/sonicnet.js/lib/sonic-server.js');
var SonicCoder = require('../node_modules/sonicnet.js/lib/sonic-coder.js');

var ALPHABET = '0123456789';
var MESSAGE = '12345';

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
        console.log(message);
    });
    sserver.start();
    console.log('listening', ALPHABET);
};

var btn = document.getElementById('start');
btn.addEventListener('click', start);