// YOUR CODE HERE:
var App = function () {
  this.server = "https://api.parse.com/1/classes/chatterbox";
  this.friends = {};
  this.user;
};

App.prototype.send = function (message) {
  $.ajax({
    url: this.server,
    type: "POST",
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (returnData) {
      console.log(returnData);
    },
    error: function (returnData) {
      console.log(returnData);
    }
  });
};

App.prototype.fetch = function(){
  $.ajax({
    url: this.server,
    type: "GET",
    success: function (returnData) {
      console.log(returnData);
    },
    error: function (returnData) {
      console.log("FAILURE, yo: " + returnData);
    }
  });
};

App.prototype.clearMessages = function () {
  $("#chats").empty();
};

App.prototype.addMessage = function(message) {
  var li = '<li class="message">';
  li += '<div class="username" id="' + message.username +'">' + message.username + '</div>';
  li += '<div class="text">' + message.text + '</div>';
  li += '</li>';

  $("#chats").append(li);
};

App.prototype.addRoom = function(room){
  var li = '<li class="room" id="'+room+'">' + room + '</li>';

  $('#roomSelect').append(li);
};

App.prototype.addFriend = function(username) {
  this.friends[username] = username;
};


App.prototype.init = function () {
  var that = this;

  $('#main').find('.username').on('click', function(){
    var username =$(this).attr('id');
    that.addFriend(username);
  });

  $('#send .submit').submit(function() {
    var message = {
      username: that.user,
      text: $('#message').text(),
      roomname: $(this).parent().attr('id')
    };
    that.send(message);
  });
};



var app = new App();
