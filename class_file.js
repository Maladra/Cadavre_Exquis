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

module.exports = {
    player_role,
    game_room
};