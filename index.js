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
            console.log("la salle existe deja")
        }
        else{
            socket.join(msg)
            console.log("la salle n'existe pas")
        }
        socket.room_joined = msg
        console.log(socket.room_joined)

        // a voir sans fonction fléchée
        io.of('/').in(msg).clients((error,client) => {
            if (error) throw error;
            console.log(client);
        });
        console.log(socket.id)

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
