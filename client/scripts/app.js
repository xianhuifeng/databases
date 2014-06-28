var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
  username: '',
  currentRoom: 'black hole',
  friends: {},
  roomList: {},

  init: function(){
    // set username
    app.username = document.URL.split('username=')[1];

    // detect sending messages
    $('#send .submit').on('click', function (event) {
      event.preventDefault();
      app.handleSubmit();
    });

    // grab messages continuously
    setInterval(function(){
      app.fetch(app.addMessages, true);
      app.fetch(app.getRooms);
    }, 1000);

  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        console.log('chatterbox: Message sent');
      },
      error: function(data){
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(callback, filter) {
    var query = {order: '-createdAt'};

    if (filter) {
      query = {order: '-createdAt', where: {roomname: app.currentRoom}};
    }
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: query,
      success: function(data){
        console.dir(data.results);
        callback(data.results);
        console.log('chatterbox: Message received');
      },
      error: function(data){
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  addMessages: function(messages){
    app.clearMessages();
    for(var i = 0; i< messages.length; i++){
      var renderedMessage = app.renderMessage(messages[i]);
      $('#chats').append(renderedMessage);
    }
    app.addFriend();
  },

  renderMessage: function(message) {
    var $user = $('<div>', {class: 'username'}).text(message.username);
    var $text = $('<div>', {id: 'message'}).text(message.text);
    if (app.friends[message.username]){
      $text.addClass('friend');
    }
    var $message = $('<div>', {class: 'chat', 'data-id': 'message.objectId'}).append($user, $text);
    return $message;
  },

  clearMessages: function() {
    $('#chats .chat').remove();
  },

  handleSubmit: function(){
    //build message object
    var message = {
      'username': app.username,
      'text': $('#message').val(),
      'roomname': app.currentRoom
    };
    $('#message').val('');
    app.send(message);
  },

  getRooms: function(messages){
    app.roomList = {}; // Refactor to update instead of empty
    for(var i = 0; i < messages.length; i++){
      var roomname = messages[i].roomname;
      if(!app.roomList[roomname]){
        app.roomList[roomname] = true;
      }
    }
    app.listRooms();
    app.addRoomListener();
  },


  listRooms: function(){
    $('#roomList').empty(); // Refactor to update instead of empty
    for(var roomname in app.roomList){
      var renderedRoom = app.renderRoom(roomname);
      $('#roomList').append(renderedRoom);
    }
  },

  renderRoom: function(roomname){
    $roomname = $('<div>', {class: 'room'}).text(roomname);
    return $roomname;
  },

  addRoomListener: function() {
    // detect room selection
    $('#roomList .room').on('click', function(){
      // update currentRoom variable
      app.currentRoom = $(this).text();
      // set current room in div
      $('#roomSelect').text(app.currentRoom);
      // clear messages
      // app.clearMessages();
      // fetch messages in room
      app.fetch(app.addMessages, true);
    });
  },

  addFriend: function() {
    $('.username').on('click', function() {
      app.friends[$(this).text()] = true;
      app.fetch(app.addMessages, true);
    });
  }
};

