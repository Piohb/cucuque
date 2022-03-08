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

    joinRoom: function(room, socket) {
        let uid = room.uid

        if (!room.full){
            rooms.filter(room => uid)[0].users.push(socket.id)
        } else {
            let room = this.findOrCreate(room.genre)
            uid = room.uid
        }

        socket.join(room.uid)
        this.IsFull(uid)
    },

    leaveRoom: function (socket){
        let room = rooms.filter(room => socket.id)[0]
        let index = room['users'].indexOf(socket.id)
        if (index > -1) { room['users'].splice(index, 1) }

        socket.leave(room.uid)
        this.IsFull(room.uid)
        return room
    },

    IsFull: function(uid) {
        let room = rooms.filter(room => uid)[0]
        room.full = room.users.length >= process.env.DEFAULT_MAXIMUM
    }
}