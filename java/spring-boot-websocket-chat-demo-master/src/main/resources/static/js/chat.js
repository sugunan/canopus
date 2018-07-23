'use strict';

var stompClient = null;
var username = null;

function connect() {
	var socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onError(error) {
    console.log('Could not connect to WebSocket server. Please refresh this page to try again!');
}

function sendMessage() {
    if(stompClient) {
        var chatMessage = {
            sender: "sugunan",
            content: "Hi i'm sugu",
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log(message);
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}