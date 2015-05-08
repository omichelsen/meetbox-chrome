var io = require('socket.io-client');
var moment = require('moment');
var ultraserver = require('./ultraserver');
var screenfull = require('screenfull');

var expirationTime = 20;

function join(sessionUrl) {
    console.log('join', sessionUrl);

    // message the event page to start a session
    chrome.runtime.sendMessage({url: sessionUrl}, function(response) {
        console.log('event msg response', response);
    });
}

// UI
var elmTime = document.getElementById('time'),
    elmDefault = document.getElementById('state-default'),
    elmProximity = document.getElementById('state-proximity'),
    elmMeeting = document.getElementById('meeting'),
    elmMeetingUser = document.getElementById('meeting-user'),
    elmMeetingUsers = document.getElementById('meeting-users'),
    elmMeetingName = document.getElementById('meeting-name'),
    elmMeetingCountdown = document.getElementById('meeting-countdown'),
    elmStartsIn = document.getElementById('starts-in'),
    present = {},
    names = [],
    countdownTicker;

setInterval(function () {
    elmTime.textContent = moment(Date.now()).format('LT');
}, 1000);

function formatName(name) {
    return name.substring(0, name.indexOf(' '));
}

function getNamesFromPresent() {
    var names = [];
    for (var key in present) {
        names.push(formatName(present[key].profile.name));
    }
    return names;
}

setInterval(kickPeopleOut, 2000);

function kickPeopleOut() {
    for (var userKey in present){
        if (present.hasOwnProperty(userKey) && present[userKey].expires.isBefore(moment())){
            removeUser(present[userKey]);
        }
    }
    refreshView();
}

function addUser(user) {
    if (present.hasOwnProperty(user.profile.user_id)) {
        present[user.profile.user_id].expires = moment().add(expirationTime, 'seconds');
        return;
    }

    present[user.profile.user_id] = user;
    present[user.profile.user_id].expires = moment().add(expirationTime, 'seconds');

    elmMeetingUser.textContent = getNamesFromPresent().join(', ');



    var elmUser = document.createElement('img');
    elmUser.id = 'u' + user.profile.user_id;
    elmUser.src = user.profile.image.thumbnail_link;
    elmMeetingUsers.appendChild(elmUser);
}

function removeUser(user) {
    delete present[user.profile.user_id];
    elmMeetingUser.textContent = getNamesFromPresent().join(', ');
    var elmUser = document.getElementById('u' + user.profile.user_id);
    if (elmUser) elmMeetingUsers.removeChild(elmUser);
}

function setMeetingCountdown(date) {
    clearInterval(countdownTicker);
    countdownTicker = setInterval(function () {
        elmStartsIn.textContent = moment.utc(date).isBefore(moment.utc()) ? "started" : "is starting"
        elmMeetingCountdown.textContent = moment.utc(date).from(Date.now());
    }, 1000);
}

function setPresence(info) {
    if (info.meeting) {
        elmMeetingName.textContent = info.meeting.title;
        setMeetingCountdown(info.meeting.startTimeUTC);
        elmMeeting.classList.remove('hide');
    }

    if (info.left) {
        removeUser(info.user);
    } else {
        addUser(info.user);
    }

    refreshView();
}

function refreshView() {
    elmDefault.classList.toggle('hide', elmMeetingUsers.childElementCount > 0);
    elmProximity.classList.toggle('hide', elmMeetingUsers.childElementCount === 0);

    if (elmMeetingUsers.childElementCount === 0) {
        clearInterval(countdownTicker);
        elmMeeting.classList.add('hide');
    }
}


// Ultra sonic broadcasting & listening
ultraserver.start(join);


// Server notifications
var socket = io.connect('http://meetbox.ngrok.io');

socket.on('join/LENNON', function (data) {
    console.log('socket join', data);
    var sessionUrl = data.meeting.url;
    if (data.user && data.user.profile && data.user.profile.name) {
        sessionUrl += '#' + encodeURIComponent(data.user.profile.name);
    }
    join(sessionUrl);
});

socket.on('presence/LENNON', function (data) {
    console.log('socket presence', data);
    setPresence(data);
});


document.addEventListener('click', function () {
    if (screenfull.enabled) {
        screenfull.request();
    }
});
