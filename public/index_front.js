$(document).ready(function () {
    $('#select_username').fadeIn("slow", function () {
    });
});

$(function () {
var socket = io(); // initialise socket
var username; // username for the socket

// event send username on server
$('#set_username').click(function () {
    username = $('#username').val();
    socket.emit('set_username', username)
});
// display room selector if server validate the username
socket.on('username_validate', function () {
    $('#select_username').fadeOut("fast", function (){
        $('#join_select_room').fadeIn("fast")
    });
    
})

// event send create/join socket on server and display game room
$('#set_room').click(function () {
    room_name = $('#choose_room').val()
    socket.emit('join_room',room_name)
});

<<<<<<< HEAD
$('#join_random_room').click(function () {
socket.emit('join_random_room')
=======
socket.on('room_validate', function () {
    $('#join_select_room').fadeOut("fast", function (){
        $('#game_room').fadeIn("fast")
    });  
})

// event join random room
$('#random_room_button').click(function () {
    socket.emit('join_random_room')
>>>>>>> testing
});

// form submit (for tchat)
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

// append the tchat with message
socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

// recoit et affiche le role de la personne
socket.on('game_role', function (msg){
    $('#wait_game').fadeOut("fast", function () {
        $('#reponse_text').fadeOut("fast", function () {
            $('#game_reponse_label').text(msg +" :")
            $('#game_interact').fadeIn("fast")
        });
        
    });
})

// recoit la reponse et l'affiche
socket.on('game_response', function (msg) {
    $("#game_interact").fadeOut("fast", function () {
        $('#reponse_text').text(msg);
        $('#reponse_text').fadeIn("fast")
    });
})

// gestion erreur perso
socket.on('error_perso', function(msg) {
    alert(msg)
})

// button for sending reponse game
$('#game_reponse_click').click(function () {
    reponse = $('#reponse_game').val();
    socket.emit('game_reponse', reponse)
})
socket.on('reponse_game_validate', function () {
    $("#game_interact").fadeOut("fast");
})


});
