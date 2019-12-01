function room_exist(msg,io) {
    // permet d'avoir la liste des rooms
    var existe = false
    for (let key in io.sockets.adapter.rooms)
    {
        if(msg == key){
            existe = true;
            break;
        }
    }
    return existe;
};

exports.room_exist = room_exist;