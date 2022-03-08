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
        Room.addToRoom(currentRoom, socket.id)

        socket.join(currentRoom.uid)
        socket.to(currentRoom.uid).emit("someoneJoined", "Le joueur " + currentUser.username + " vient de rentrer dans la room " + currentRoom.genre)

        //console.log(user, room)
        //console.log('env', users, rooms)

        /*const user = userJoin(socket.id,userName,room,0,playerImg,false);
        socket.join(user.room);
        io.of("/genre").to(user.room).emit("newUser", user.username+" est rentré dans: "+room+" faites lui une ovation");
        io.of("/genre").to(user.room).emit("roomInfo",{
            room: user.room,
            users: getAllPlayerForRoom(user.room)
        });
        if(getAllPlayerForRoom(user.room).length > 1)
        {
            io.of("/genre").to(user.room).emit('Waiting',user.username+" attendez la prochaine musique avant de pouvoir jouer");
        }else{
            launchGame(user);
        }*/
    });
}