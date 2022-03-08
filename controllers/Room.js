const { v4: uuidv4 } = require('uuid')
const Music = require('../controllers/Music')
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

    startGame: async function (socket, room){
        console.log('startGame')
        try {
            let playlists = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1", 'GET')
            let random = Math.floor(Math.random() * playlists.data.playlists.total - 1)
            let playlist = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1&offset=" + random, 'GET')
            console.log(playlist.data, 'cucu')

            let tracks = await Music.Request(playlist.data.playlists.href, 'GET')
            tracks = tracks.data.playlists.items[0].tracks
            console.log(tracks, 'zizi')

             Music.Request(tracks.href, 'GET')
                 .then( (res) => {
                     console.log(res.data)
                 })

        } catch (err){
            throw err
        }

    },

    IsFull: function(uid) {
        let room = rooms.filter(room => uid)[0]
        room.full = room.users.length >= process.env.DEFAULT_MAXIMUM
    }
}