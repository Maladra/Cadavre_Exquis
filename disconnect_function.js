function disconnect_function (socket,room_list,io) {
// si l'utilisateur est dans une room
    if (typeof(socket.room_joined) == 'string') {
        var room_leaved = room_list.find(r => r.room_name == socket.room_joined)
        io.of('/').in(socket.room_joined).clients(function(error,client){
            if (error) throw error;
            // si il y'a 0 client ou moins dans une salle on arrête la loop game
            if (client.length <= 0)
            {
                clearInterval(room_leaved.loop_game)
                // iteration sur la liste des rooms et la retire si elle est vide (check a chaque deconnexion)
                remove_room(room_list, room_leaved)
            }
        });
    }
}

function remove_room(room_list, room_leaved) {
    for (var i = 0; i < room_list.length; i++){
        if (room_list[i].room_name == room_leaved.room_name){
            room_list.splice(0,1)
        }
    }    
}


exports.disconnect_function = disconnect_function;