const User = require('./User')
const users = {}

module.exports = function (socket){
    // on connection
    socket.on("zizi", () =>{
        console.log('zizi')
    })

    // on room connection
    socket.on("joinRoom", async ({id, room}) => {
        const user = await User.getUser(id)
        socket.emit("someoneJoined", "Le joueur " + user.username + " vient de rentrer dans la room " + room)
        console.log(user, room)

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