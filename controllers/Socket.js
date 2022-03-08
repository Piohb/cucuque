const User = require('./User')
const Room = require('./Room')
global.users = {}
global.rooms = []

module.exports = function (socket){
    // on connection
    socket.on("zizi", () =>{
        console.log('zizi')
    })

    // on room connection
    socket.on("joinRoom", async ({genre, user}) => {
        const currentRoom = Room.findOrCreate(genre)
        const currentUser = await User.socket.findOrCreate(socket.id, user)
        Room.joinRoom(currentRoom, socket)

        socket.to(currentRoom.uid).emit("someoneJoined", currentUser)
        //socket.to(currentRoom.uid).emit("someoneJoined", "Le joueur " + currentUser.username + " vient de rentrer dans la room " + currentRoom.genre)
    })

    socket.on("disconnect",() => {
        //const currentUser = users[socket.id]
        const currentRoom = Room.leaveRoom(socket)

        socket.to(currentRoom.uid).emit("someoneLeaved", socket.id)
        //socket.to(currentRoom.uid).emit("someoneLeaved", "Le joueur " + currentUser.username + " vient de quitter la room " + currentRoom.genre)
    })
}