const { v4: uuidv4 } = require('uuid')
const Music = require('../controllers/Music')
const { random } = require('../utils.js')
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

    startGame: async function (room){
        try {
            console.log('startGame', room)
            let playlists = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1", 'GET')
            let playlist = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1&offset=" + random(0, playlists.data.playlists.total - 1), 'GET')

            console.log(playlist.data.playlists.href)
            let tracks = await Music.Request(playlist.data.playlists.href, 'GET')
            tracks = tracks.data.playlists.items[0].tracks

            console.log(tracks.href)
            let res = await Music.Request(tracks.href + '?market=FR&fields=items(track(name, preview_url, album(images), artists))', 'GET')

            let randomTracks = []
            while(randomTracks.length < process.env.DEFAULT_TRACKS){
                console.log('ici')
                let r = random(0, res.data.items.length - 1)
                if(randomTracks.indexOf(r) === -1) { randomTracks.push(res.data.items[r]) }
            }

            return randomTracks

        } catch (err){
            throw err
        }

    },

    updateGame: function (io, uid, index, tracks){
        if (index < tracks.length - 1){
            io.in(uid.uid).emit("blindTrack", tracks[index])
            console.log('update', tracks[index].track.name)

            setTimeout( () => {
                this.updateGame(io, uid, index+1, tracks)
            }, 1000 * 5 )
        } else {
            this.endGame(io, uid)
        }
    },

    endGame: function (io, uid){
        console.log('endGame')
        let players = [], room = rooms.filter(room => uid)[0]
        room.users.forEach( (user) => {
            users[user].answers.ready = false
            players.push(users[user])
        })

        io.in(uid).emit("endGame", players)
    },

    IsFull: function(uid) {
        let room = rooms.filter(room => uid)[0]
        room.full = room.users.length >= process.env.DEFAULT_MAXIMUM
    }
}