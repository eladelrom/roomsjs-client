/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

'use strict';

var isAutoConnect = false,
  rooms,
  userId,
  roomName;

function listenToUserActions() {
  $("#getResultsButton").bind('click', function () {
    serviceCall('getitems', 'messageFromRoomCallBackfunction');
    serviceCall('getnames', 'messageFromRoomCallBackfunction');
  });
}

function connectToSocket() {
  var hostName = window.location.hostname,
    port,
    roomSetup,
    transporter,
    connectURL;

  userId = Rooms.makeid(16);
  roomName = window.location.href;
  port = (hostName !== '0.0.0.0' && hostName !== 'localhost') ? '80' : '8081';
  connectURL = 'http://' + hostName + ':' + port;

  roomSetup = {
    roomName : roomName,
    subscriptions : {
        RoomInfoVO : true
    }
  };

  rooms = new Rooms({
    roomSetup : roomSetup,
    userConnectedCallBackFunction : userConnectedCallBackFunction,
    userRegisteredCallBackFunction : userRegisteredCallBackFunction,
    numOfUsersInARoomCallBackFunction : numOfUsersInARoomCallBackFunction,
    stateChangeCallBackFunction : stateChangeCallBackFunction,
    debugMode : true
  });

  transporter = io.connect(connectURL);

  rooms.start({
    transporter : transporter,
    type : 'socket.io'
  });
}

function stateChangeCallBackFunction(data) {
  // impl
}

function userConnectedCallBackFunction() {
  if (isAutoConnect) {
      rooms.registerUser(userId);
  }
}

function userRegisteredCallBackFunction() {
  rooms.getNumberOfRegisteredUsersInRoom(userId);
}

function numOfUsersInARoomCallBackFunction(data) {
  var numofppl = data.size;
  document.getElementById('visitors').innerHTML = '<div style="font-size: 15px; top: 5px">Currently there are <b>'+numofppl+'</b> visitors on this page</div>';

  if (data.hasOwnProperty('register')) {
      sendMessageToLog('register userId: ' + data.register);
  } else if (data.hasOwnProperty('disconnect')) {
      sendMessageToLog('disconnect userId: ' + data.disconnect);
  }
}

function messageFromRoomCallBackfunction(data) {
  sendMessageToLog('messageFromRoomCallBackfunction');
  sendMessageToLog(JSON.stringify(data.vo));
}

function messageFromRoomCallBackfunction2(data) {
  sendMessageToLog('messageFromRoomCallBackfunction2');
  sendMessageToLog(JSON.stringify(data.vo));
}

function connectUser() {
  isAutoConnect = true;
  connectToSocket();
}

if (typeof jQuery !== 'undefined') {
  $(document).ready(function () {
    connectUser();
    listenToUserActions();
  });
} else {
  sendMessageToLog('jQuery not loaded');
}

function serviceCall(serviceMethodName, retCallBackName, params) {
  console.log('Calling: ' + serviceMethodName);
  rooms.callDbConnector(userId, serviceMethodName, retCallBackName, params);
}