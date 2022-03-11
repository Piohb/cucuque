const { v4: uuidv4 } = require('uuid')
const Music = require('../controllers/Music')
const { random } = require('../utils.js')
const CronJob = require('cron').CronJob
const natural = require('natural')
require("dotenv/config")

//=== SOCKET ROOM MODEL
//  id
//  genre
//  currentTrack
//  trackTime
//  users
//  full

module.exports = {

    findOrCreate: function(genre){
        let condition = rooms.filter( room => room.genre === genre && !room.full )

        if (condition.length === 0){
            rooms.push({
                'uid': uuidv4(),
                'genre': genre,
                'currentTrack': null,
                'timestamp': null,
                'users': [],
                'full': false,
            })
        }

        return rooms[rooms.length - 1]
    },

    joinRoom: function(socket, room) {
        if (!room.full){
            rooms.filter(filteredRoom => filteredRoom.uid === room.uid)[0].users.push(socket.id)
        } else {
            room = this.findOrCreate(room.genre)
        }

        socket.join(room.uid)
        this.IsFull(room.uid)
    },

    leaveRoom: function (socket){
        console.log('leaveRoom', rooms.filter(room => room.users.includes(socket.id))[0])
        let room = rooms.filter(room => room.users.includes(socket.id))[0]
        let index = room['users'].indexOf(socket.id)
        if (index > -1) { room['users'].splice(index, 1) }

        socket.leave(room.uid)
        this.IsFull(room.uid)
        //console.log(rooms)
        return room
    },

    startGame: async function (room){
        try {
            console.log('startGame', room.genre)
            let playlists = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1", 'GET')
            let playlist = await Music.Request("https://api.spotify.com/v1/browse/categories/" + room.genre + "/playlists?country=FR&limit=1&offset=" + random(0, playlists.data.playlists.total - 1), 'GET')

            console.log(playlist.data.playlists.href)
            let tracks = await Music.Request(playlist.data.playlists.href, 'GET')
            tracks = tracks.data.playlists.items[0].tracks

            console.log(tracks.href)
            let res = await Music.Request(tracks.href + '?market=FR&fields=items(track(id, name, preview_url, album(images), artists))', 'GET')

            let randomTracks = []

            while(randomTracks.length < process.env.DEFAULT_TRACKS){
                let r = random(0, res.data.items.length - 1)
                if( (randomTracks.filter(randomTrack => randomTrack.track.id === res.data.items[r].track.id).length === 0) && (res.data.items[r].track.preview_url) ){
                    randomTracks.push(res.data.items[r])
                }
                console.log('ici', res.data.items[r].track.id)
            }

            return randomTracks

        } catch (err){
            throw err
        }

    },

    updateGame: function (io, uid, index, tracks){
        console.log('updateGame')
        let currentRoom = rooms.filter(room => room.uid === uid)[0]
        let cron = {
            cronTime: '*/30 * * * * *',
            onTick: () => {
                if (index < tracks.length - 1) {
                    io.in(uid).emit("blindTrack", tracks[index])
                    currentRoom.currentTrack = tracks[index]
                    currentRoom.timestamp = Math.round(new Date().getTime())
                    currentRoom.users.forEach(user => {
                        users[user].answers = {
                            ready: true,
                            asArtist: false,
                            asSong: false
                        }
                    })
                    console.log(currentRoom.genre, 'update', tracks[index].track.name, '|', tracks[index].track.artists[0].name)
                    index++
                } else {
                    this.endGame(io, uid)
                    tasks[currentRoom.uid].stop();
                }
            },
            start: true,
            runOnInit: true,
            timeZone: 'Europe/Paris'
        }

        tasks[currentRoom.uid] = new CronJob(cron)

    },

    endGame: function (io, uid){
        console.log('endGame')
        let players = [], room = rooms.filter(room => room.uid === uid)[0]
        room.currentTrack = null
        room.timestamp = null
        room.users.forEach( (user) => {
            users[user].answers.ready = false
            users[user].score = 0
            players.push(users[user])
        })

        io.in(uid).emit("endGame", players)
    },

    answerRegex: function (answer, currentTrack, socket){
        console.log('regex', answer)
        //let banWords = ['mix','remix','mono version', 'stereo version', 'radio edit', 'remastered','feat', 'featuring']
        // bannir remix, remastered, featuring et () ou -
        // delete espace et accents
        // tolowercase
        // naturalStringDistance si en dessous de 2 fautes
        // phonétique return true alors juste

        let asSong = users[socket.id].answers.asSong, asArtist = users[socket.id].answers.asArtist
        let cleanAnswer = this.Normalize(answer)
        let cleanTrackName = this.Normalize(currentTrack.track.name)
        let cleanArtist = this.Normalize(currentTrack.track.artists[0].name)

        console.log('clean:', cleanAnswer, '|', cleanTrackName, '|', cleanArtist)

        let findTrackName = natural.LevenshteinDistanceSearch(cleanTrackName, cleanAnswer)
        if (findTrackName.distance <= 3){ asSong = true }
        console.log('song', findTrackName, asSong)

        let findArtist = natural.LevenshteinDistanceSearch(cleanArtist, cleanAnswer)
        if (findArtist.distance <= 3){ asArtist = true }
        console.log('artist', findArtist, asArtist)

        if ( asSong && asArtist && !(users[socket.id].answers.done) ){
            users[socket.id].answers.done = true
        }

        return { ready: true, asSong: asSong, asArtist: asArtist, done: users[socket.id].answers.done}
    },

    Normalize: function (text){
        text = text.replace(/-\s(.*)|\((.*?)\)/gis, '')
        text = text.toLowerCase()
        return text.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    },

    IsFull: function(uid) {
        let room = rooms.filter(room => room.uid === uid)[0]
        room.full = room.users.length >= process.env.DEFAULT_MAXIMUM
    }
}