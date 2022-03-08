const { v4: uuidv4 } = require('uuid')
require("dotenv/config")

//=== SOCKET ROOM MODEL
//  id
//  genre
//  users
//  full

module.exports = {

    findOrCreate: function(genre){
        let condition = rooms.filter(room => room.genre === genre && !room.full )

        if (condition.length === 0){
            rooms.push({
                'uid': uuidv4(),
                'genre': genre,
                'users': [],
                'full': false,
            })
        }

        return rooms[rooms.length - 1]
    },

    addToRoom: function(room, id) {
        let uid = room.uid

        if (!room.full){
            rooms.filter(room => uid)[0].users.push(id)
        } else {
            let room = this.findOrCreate(room.genre)
            uid = room.uid
        }

        this.IsFull(uid)
    },

    IsFull: function(uid) {
        let room = rooms.filter(room => uid)[0]
        if (room.users.length >= process.env.DEFAULT_MAXIMUM){ room.full = true }
        console.log(rooms)
    }
}