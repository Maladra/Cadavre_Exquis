var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { player_role, game_room } = require('./class_file')
const { disconnect_function } = require('./disconnect_function')
const { join_room_function } = require ('./join_room_function')
const { join_random_room_function } = require ('./join_random_room_function')
const { room_exist } = require ('./room_exist_function')
const { delete_function } = require ('./delete_function')
global.room_list = []

app.use(express.static(__dirname + "/public"));

// Creation socket
io.on('connection', function (socket) {
    console.log('a user connected');

    // get username for socket
    socket.on('set_username',function (msg) {
        socket.username = msg;
        socket.emit('username_validate')
    });

    // on socket disconnect
    socket.on('disconnect', function () {
        console.log('user disconnected')
        disconnect_function(socket, room_list, io)

    });

    // on user join a room
    socket.on('join_room', function (msg) {
        if(room_exist(msg, io)){
            socket.room_joined = msg
            join_room_function(io, socket, msg)
        }
        else{
            socket.join(msg)
            console.log("la salle n'existe pas")
            socket.room_joined = msg
            room_list.push(new game_room(socket.room_joined, setInterval(game, 20000, socket.room_joined, socket)))
            socket.emit('room_validate')
        }
    });

    // join random room 
    socket.on('join_random_room', function () {
        if (room_list === undefined || room_list.length == 0)
        {
            socket.emit("error_perso", "Aucune salle existante")
            console.log("Aucune salle existante")
        }
        else {

            join_random_room_function (io, socket, room_list)
        }
    });

    // on message chat
    socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
            console.log(socket.room_joined)
            io.in(socket.room_joined).emit('chat message', socket.username +" : " + msg);
    });

    // send the response of game
    socket.on('game_reponse', function (msg) {
        var get_room_joined = room_list.find(r => r.room_name == socket.room_joined)
        
        switch(socket.role) {
            case 'sujet':
                get_room_joined.sujet = msg
                break;
            case 'complement':
                get_room_joined.complement = msg
                break;
            case 'verbe':
                get_room_joined.verbe = msg
                break;
            case 'adjectif':
                get_room_joined.adjectif = msg
                break;
            case 'adjectif_bis':
                get_room_joined.adjectif_bis = msg
                break;
        }
        socket.emit('reponse_game_validate')
        console.log(get_room_joined)
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


function game(socket_joined,socket) {
    var quantit_player;
    var player_role_array = []

    io.of('/').in(socket_joined).clients(function(error, client){
        if (error) throw error;

        switch(true) {
            case client.length <= 3:
                console.log('3')
                var role = ["sujet","verbe", "complement"]
                quantit_player = client.length
                break;
            case client.length == 4:
                console.log('4')
                var role = ['sujet', 'verbe', 'complement', 'adjectif']
                quantit_player = client.length
                break;
            case client.length == 5:
                console.log('5')
                var role = ["sujet", "verbe", "complement", "adjectif", "adjectif_bis"]
                quantit_player = client.length
                break;
        }
        
        console.log(client.length)
            // assignation rôle a une socket utilisateur
            client.forEach(function (user) {
                var item_place = Math.floor(Math.random()*role.length)
                var user_role = role[item_place]
                var my_socket = io.of('/').connected[user]
                role.splice(item_place,1)
                io.to(user).emit('game_role',user_role);
                player_role_array.push(new player_role(user_role,user))
                my_socket.role = user_role
        });
    })
        setTimeout(function () {
            console.log("send response")
            var get_room_joined = room_list.find(r => r.room_name == socket_joined)
            io.of('/').in(socket_joined).clients(function (error,client){
                if (error) throw error;
                if (quantit_player == 0)
                    return null;
                if (quantit_player <= 3) {
                    client.forEach(function(user) {
                        io.to(user).emit('game_response', get_room_joined.sujet + " " + get_room_joined.verbe + " " + get_room_joined.complement)
                        var user_get_response = player_role_array.find(r => r.id == user)
                        console.log(user_get_response)
                    })
                 }
                else if (quantit_player == 4) {
                    client.forEach(function(user) {
                        io.to(user).emit('game_response', get_room_joined.sujet + " " + get_room_joined.verbe + " " + get_room_joined.complement + " " + get_room_joined.adjectif)
                        var user_get_response = player_role_array.find(r => r.id == user)
                        console.log(user_get_response)
                    })
                 }
                else if (quantit_player == 5) {
                    client.forEach(function(user) {
                        io.to(user).emit('game_response', get_room_joined.sujet + " " + get_room_joined.verbe + " " + get_room_joined.complement + " " + get_room_joined.adjectif + " " + get_room_joined.adjectif_bis)
                        var user_get_response = player_role_array.find(r => r.id == user)
                        console.log(user_get_response)
                    })
                }
                delete get_room_joined.sujet
                delete get_room_joined.verbe
                delete get_room_joined.complement
                if (quantit_player >= 4) {
                    delete get_room_joined.adjectif
                }
                if (quantit_player >= 5) {
                    delete get_room_joined.adjectif_bis
                }
            })
        }, 15000);
};