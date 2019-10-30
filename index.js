var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var room_list = [];

app.use(express.static(__dirname + "/public"));

// Creation socket
io.on('connection', function (socket) {
    console.log('a user connected');
    
    // get username for socket
    socket.on('set_username',function (msg) {
        socket.username = msg;
        console.log(socket.username)
    });

    // on socket disconnect
    socket.on('disconnect', function () {
        console.log('user disconnected')
        if (typeof(socket.room_joined) == 'string') {
            var room_leaved = room_list.find(r => r.room_name == socket.room_joined)
            io.of('/').in(socket.room_joined).clients(function(error,client){
                if (error) throw error;
                if (client.length <= 0)
                {
                    console.log("client inférieur a 0")
                    console.log(socket.role)
                    clearInterval(room_leaved.loop_game)
                    console.log(room_list.length)
                    for (var i = 0; i < room_list.length; i++){
                        console.log(i)
                        if (room_list[i].room_name == room_leaved.room_name){
                            console.log(typeof(room_list[i].room_name))
                            room_list.splice(0,1)
                            console.log(room_list)
                        }
                    }
                }
            });

        }
        
    });

    // on user join a room
    // set socket.room_joined
    socket.on('join_room', function (msg) {
        if(room_exist(msg)){
            console.log("la salle existe deja")
            socket.room_joined = msg
            io.of('/').in(socket.room_joined).clients(function(error,client){
                if (error) throw error;

                // terme remplacer par 5
                if (client.length < 3)
                {
                    socket.join(msg)
                    console.log("room joined")
                }
                else {
                    console.log("salle pleine")
                }
            });
        }
        else{
            socket.join(msg)
            console.log("la salle n'existe pas")
            socket.room_joined = msg
            room_list.push(new game_room(socket.room_joined, setInterval(game, 20000, socket.room_joined, socket)))

        }
        console.log(socket.room_joined)
    });

    socket.on('join_random_room', function () {
        room_list.forEach(element => {
            io.of('/').in(element.room_name).clients((error,clients) => {
                if (error) throw error;
                console.log(clients.length)
            });
        });
    });

    socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
            console.log(socket.room_joined)
            io.in(socket.room_joined).emit('chat message', socket.username +" : " + msg);
    });

    socket.on('game_reponse', function (msg) {
        console.log(msg)
        console.log(socket.role)
        console.log(socket.room_joined)
        var get_room_joined = room_list.find(r => r.room_name == socket.room_joined)
        if (socket.role == "sujet"){
            get_room_joined.sujet = msg
        }
        
        if (socket.role == "complement")
        {
         get_room_joined.complement = msg
        }
        
        if (socket.role == "verbe")
        {
            get_room_joined.verbe = msg
        }

        console.log(get_room_joined)

    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

// Test l'existence de la room
function room_exist(msg) {
    var existe = false
    for (let key in io.sockets.adapter.rooms) // permet d'avoir la liste des rooms
    {
        if(msg == key){
            existe = true;
            break;
        }
    }
    return existe;
};
// represente la loop du jeu
function game(socket_joined,socket) {

    
    if (client.length <= 3) {
        console.log('3')
        var role = ["sujet","verbe", "complement"]
        var quantit_player = client.length

    }
    else if (client.length == 4) {
        console.log('4')
        var role = ['sujet', 'verbe', 'complement', 'complement2']
        var quantit_player = client.length
    }
    else if (client.length == 5) {
        console.log('5')
        var role = ["sujet", "verbe", "complement", "complement2", "complement3"]
        var quantit_player = client.length
    }


    var player_role_array = []
 
    io.of('/').in(socket_joined).clients(function(error,client){
            if (error) throw error;


            console.log(client.length)

            client.forEach(function (user) {
                var item_place = Math.floor(Math.random()*role.length)
                var user_role = role[item_place]
                role.splice(item_place,1)
                io.to(user).emit('game_role',user_role);
                player_role_array.push(new player_role(user_role,user))
                console.log(socket.room_joined);
                var my_socket = io.of('/').connected[user]
                my_socket.role = user_role
                console.log(my_socket.role)
            });
        });

        setTimeout(function () {
            console.log("send response")
            var get_room_joined = room_list.find(r => r.room_name == socket_joined)
            io.of('/').in(socket_joined).clients(function (error,client){
                if (error) throw error;

                if (quantit_player <= 3) {

                }
                else if (quantit_player == 4) {

                }
                else if (quantit_player == 5) {

                }
                
                client.forEach(function (user) {
                    io.to(user).emit('game_response', get_room_joined.sujet + " " + get_room_joined.verbe + " " + " " + get_room_joined.complement)
                    delete get_room_joined.sujet
                    delete get_room_joined.verbe
                    delete get_room_joined.complement
                    
                    var user_get_response = player_role_array.find(r => r.id == user)
                    console.log(user_get_response)
                })
            })
        }, 15000);
};

class player_role {
    constructor(role, id) {
        this.role = role;
        this.id = id;
    }
}

class game_room {
    constructor(room_name, loop_game, sujet, verbe, complement) {
        this.room_name = room_name;
        this.loop_game = loop_game;
        this.sujet = sujet
        this.verbe = verbe
        this.complement = complement
    }
}
