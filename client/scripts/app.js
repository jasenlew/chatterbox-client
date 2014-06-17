// YOUR CODE HERE:
var App = function () {
  this.server = "https://api.parse.com/1/classes/chatterbox?";
  this.friends = {};
  this.user= window.location.search.substr(10);
  this.rooms = {};
};

App.prototype.send = function (message) {
  $.ajax({
    url: this.server,
    type: "POST",
    data: JSON.stringify(message),
    contentType: "application/json",
    success: function (returnData) {
      console.log(returnData);
    },
    error: function (returnData) {
      console.log(returnData);
    }
  });
};

App.prototype.fetch = function(){
  var that = this;
  $.ajax({
    url: this.server,
    type: "GET",
    data: {order: "-createdAt"},
    // async: false,
    success: function (returnData) {
      that.populateChat(returnData);
    },
    error: function (returnData) {
      console.log(returnData);
    }
  });
};

App.prototype.clearMessages = function () {
  $("#chats").empty();
};

App.prototype.addMessage = function(message, roomname) {

  var element = $('li.message#'+message.objectId);
// debugger;
  if($('li.message#'+message.objectId).length < 1){
    if(message.text !== ""){
      var li = '<li class="message divider-horizontal" id="'+message.objectId+'">';
      li += '<h3><div class="username" id="' + message.username +'">' + message.username + '</div></h3>';
      li += '<div class="text">' + message.text + '</div>';
      li += '</li>';
    }
    // ONLY SAVE NEW MESSAGES
    this.rooms[roomname].find('ul.messages').append(li);
  }
};

App.prototype.addRoom = function(roomname){
    var li = '<li class="room" id="' + roomname + '">'+
              '<div class="container"><div class="jumbotron">'+
                '<h1 class="roomname">'+roomname+'</h1>'+
                '<ul class="messages"></ul>'+
                '<div class="form-horizontal">'+
                  '<form class="form-inline" role="form">'+
                  '<input type="text" class="form-control" id="messsage-text" placeholder="Keep it classy!">'+
                  '<button id="send-message" class="btn btn-primary">Submit</button>'+
                  '</form>'+
                '</div>'+
                '</div>'+
              '</li>';

    $('ul.rooms').append(li);
    this.rooms[roomname] = $('li.room#'+roomname);
};

App.prototype.addFriend = function(username) {
  this.friends[username] = username;
};

App.prototype.populateChat = function(returnData){
  console.log(returnData);
  for(var i = 0; i < returnData.results.length; i++) {
    var message = returnData.results[i];
    //check to make sure its not an undefined roomname
    if(message.roomname){
      var roomname = message.roomname.replace(/(<([^>]+)>)/ig,"");
      if (!this.rooms[roomname]) {
        this.addRoom(roomname);
      }

      this.addMessage(message, message.roomname);

      // console.log("User: " + message.username);
      // console.log("Message: " + message.text);
      // console.log("Roomname: " + message.roomname);
      // console.log("-------");

    }
  }
};


/*--
-----------------------------INITIALIZATION-----------------------
 */
App.prototype.init = function () {
  var that = this;

  this.fetch();

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

  setInterval(function() {that.fetch()}, 1000);
};

var app = new App();
app.init();
