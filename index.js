var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var room_list = [];

app.use(express.static(__dirname + "/public"));

//creation socket
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
    });

    // on user join a room
    // set socket.room_joined
    socket.on('join_room', function (msg) {
        if(room_exist(msg)){
            socket.join(msg)
            socket.room_joined = msg
            console.log("la salle existe deja")
        }
        else{
            socket.join(msg)
            console.log("la salle n'existe pas")
            socket.room_joined = msg
            game_test(socket_joined=socket.room_joined)
        }
        console.log(socket.room_joined)

        socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
            console.log(socket.room_joined)
            io.in(socket.room_joined).emit('chat message', socket.username +" : " + msg);
        });
        socket.on('disconnect', function(){
            console.log("room leaved")
        })
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


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





function game_test(socket_joined) {
    var role = ["sujet", "verbe","complement"]
    var controle = 0

    setTimeout(function () {
    io.of('/').in(socket_joined).clients(function(error,client){
            if (error) throw error;
            client.forEach(function (user) {
                io.to(user).emit('game_role',role[controle]);
                console.log(user);
                controle = controle+1;
                if (controle > 2){
                    controle = 0;
                }
                
            });
        });
    }, 10000);
};


function game(user_array) {
    var role = ["sujet","verbe","complement"]
    var controle = 0
    var player_role_array = [];
    var phrase = ["empty","empty","empty"];
    
    user_array.forEach(function (user) {
        io.to(user).emit('game_role',role[controle]);
        player_role_array.push(new player_role(role[controle], user))
        controle = controle+1;

    });
    socket.on('game_reponse',function (reponse) {
        console.log(socket.id);
        player_role_array.forEach(player => {
            if (player.id == socket.id){
                if (player.role == "sujet"){
                    role[0] = reponse;

                }
                if (player.role == "verbe"){
                    role[1] = reponse;

                }
                if (player.role == "complement"){
                    role[2] = reponse;

                }
            }

            
        });


        
    })
};

class player_role {
    constructor(role, id) {
        this.role = role;
        this.id = id;
    }
}