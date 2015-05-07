var io = require('socket.io-client');
var moment = require('moment');
var ultraserver = require('./ultraserver');

function join(sessionUrl) {
    console.log('join', sessionUrl);

    // message the event page to start a session
    chrome.runtime.sendMessage({url: sessionUrl}, function(response) {
        console.log('event msg response', response);
    });
}

// ultraserver.start(join);

// setTimeout(function () {join('https://next.g2m.me/lenin')}, 5000);

// UI
var elmTime = document.getElementById('time'),
    elmDefault = document.getElementById('state-default'),
    elmProximity = document.getElementById('state-proximity'),
    elmMeeting = document.getElementById('meeting'),
    elmMeetingUser = document.getElementById('meeting-user'),
    elmMeetingUsers = document.getElementById('meeting-users'),
    elmMeetingName = document.getElementById('meeting-name'),
    elmMeetingCountdown = document.getElementById('meeting-countdown'),
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

function addUser(user) {
    if (present.hasOwnProperty(user.profile.user_id)) return;

    present[user.profile.user_id] = user;

    elmMeetingUser.textContent = getNamesFromPresent().join(', ');

    var elmUser = document.createElement('img');
    elmUser.id = 'u' + user.profile.user_id;
    elmUser.src = user.profile.image.thumbnail_link;
    elmMeetingUsers.appendChild(elmUser);
}

function removeUser(user) {
    delete present[user.profile.user_id];
    var elmUser = document.getElementById('u' + user.profile.user_id);
    if (elmUser) elmMeetingUsers.removeChild(elmUser);
}

function setMeetingCountdown(date) {
    countdownTicker = setInterval(function () {
        elmMeetingCountdown.textContent = moment(date).from(Date.now());
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

    elmDefault.classList.toggle('hide', elmMeetingUsers.childElementCount > 0);
    elmProximity.classList.toggle('hide', elmMeetingUsers.childElementCount === 0);

    if (elmMeetingUsers.childElementCount === 0) {
        clearInterval(countdownTicker);
        elmMeeting.classList.add('hide');
    }
}


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

