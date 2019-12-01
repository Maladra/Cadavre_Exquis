function join_random_room_function (io, socket, room_list) {
    var room_list_counter = 0
    room_list.forEach(element => {
        room_list_counter++

        io.of('/').in(element.room_name).clients((error,clients) => {
            if (error) throw error;
            console.log(clients.length)
            if (clients.length < 5){
                socket.join(element.room_name)
                console.log(element.room_name)
                socket.emit('room_validate')
                 
            }
            
            else if (room_list_counter >= room_list.length) {
                socket.emit("error_perso", "Toutes les salles sont pleines")
            }
        });
    });
}

exports.join_random_room_function = join_random_room_function;