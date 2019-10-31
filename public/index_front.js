$(document).ready(function () {
    $('#select_username').fadeIn("slow", function () {
    });
});

$(function () {
var socket = io(); // initialise socket
var username; // username for the socket

// function for send username to server 
const send_username = function () {
    $('#select_username').fadeOut("fast", function (){
        $('#join_select_room').fadeIn("fast")
    });
    username = $('#username').val();
    socket.emit('set_username', username)
}

// function for join or create room 
const join_room = function () {
    $('#join_select_room').fadeOut("fast", function (){
        room_name = $('#choose_room').val();
        alert (room_name)
        socket.emit('join_room', room_name)
        $('#game_room').fadeIn("fast")
    });
}

// function for send reponse for game to server
const send_reponse_game = function () {
    reponse = $('#reponse_game').val();
    socket.emit('game_reponse', reponse)
    
}

// event send username on server display the room selector
$('#validate_username').click(function () {
    send_username()
});

// event send create/join socket on server and display game room
$('#validate_room').click(function () {
    join_room()
});

// event join random room
$('#random_room_button').click(function () {
    alert("aaa")
    socket.emit('join_random_room')
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
        $('#reponse_text').fadeOut("fast")
        $('#game_reponse_label').text(msg +" :")
        $('#game_interact').fadeIn("fast")
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
    send_reponse_game()
})
});
