const User = require('./User')
const Room = require('./Room')
const {random} = require("../utils.js");
global.users = {}
global.rooms = []

module.exports = (io) => {

    const socket = (socket) => {
        // on connection
        socket.on("zizi", () => {
            socket.to(socket.id).emit("cucu", 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        })

        // on room connection
        socket.on("joinRoom", ({genre, user}) => {
            let currentRoom = Room.findOrCreate(genre)
            let currentUser = User.socket.findOrCreate(socket.id, user)
            Room.joinRoom(socket, currentRoom)

            io.in(currentRoom.uid).emit("someoneJoined", currentUser)
            console.log(rooms)
        })

        socket.on("ready", async (bool) => {
            console.log('ready', bool)
            users[socket.id].answers.ready = bool

            if (bool){
                let ready = true
                const currentRoom = rooms.filter(room => socket.id)[0]
                console.log(currentRoom.users)
                currentRoom.users.forEach( (id) => {
                    console.log(users[id])
                    if ( !(users[id].answers.ready) ){
                        ready = false
                    }
                })

                if (ready){
                    let randomTracks = await Room.startGame(currentRoom)
                    console.log('aaaa', randomTracks.length)
                    Room.updateGame(io, currentRoom.uid, 0, randomTracks)
                }
            }

        })

        socket.on("sendAnswer", async (answer) => {
            console.log(answer)
        })

        socket.on("leaveRoom", () => {
            let currentRoom = Room.leaveRoom(socket)
            io.in(currentRoom.uid).emit("someoneLeaved", socket.id)
        })

        socket.on("disconnect", () => {
            console.log('disconnected', socket.id)
            const currentRoom = Room.leaveRoom(socket)
            io.in(currentRoom.uid).emit("someoneLeaved", socket.id)
        })
    }

    return { socket }
}