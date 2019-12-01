function join_room_function (io, socket, msg) {
    io.of('/').in(socket.room_joined).clients(function(error,client){
        if (error) throw error;
        // max client par salle
        if (client.length < 5)
        {
            socket.join(msg)
            socket.emit('room_validate')
        }
        else {
            socket.emit('error_perso', "Nombre de personne maximum atteint")
        }
    });    
}

exports.join_room_function = join_room_function;