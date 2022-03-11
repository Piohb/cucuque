const User = require("../models").User

module.exports = {

    //=== GET ALL USERS
    getUsers: async function(){
      try {
          return await User.findAll()
      } catch (e) {
          throw new Error(e)
      }
    },

    //=== GET USER BY ID
    getUser: async function(id){
        try {
            return await User.findOne({ where : { id:id } })
        } catch (e) {
            throw new Error(e)
        }
    },

    //=== GET USER BY EMAIL
    findUserByEmail: async function (email) {
        try {
            return await User.findOne({ where : { email:email } })

        } catch (err) {
            throw new Error(err);
        }
    },

    //=== GET USER BY TOKEN
    findUserByToken: async function (token) {
        try {
            return await User.findOne({ where : { token:token } })

        } catch (err) {
            throw new Error(err);
        }
    },

    //=== CREATE USER
    create: async function (data){
        try {
            return await User.create(data)

        } catch (err) {
            throw new Error(err)
        }
    },

    update: async function (user, data){
        try {
            user.set({...user, ...data})
            return await user.save()

        } catch (err) {
            throw new Error(err)
        }
    },

    //=== SOCKET USER MODEL
    //  id
    //  username
    //  profile_pic
    //  score
    //  answers : { ready, asArtist, asSong }
    socket:{
        findOrCreate: function(id, user){
            if ( !(id in users) ) {
                users[id] = {
                    'id': id,
                    'username': user.username,
                    'profile_pic' : user.profile_pic,
                    'score': 0,
                    'answers': {
                        'ready': false,
                        'asArtist': false,
                        'asSong': false,
                        'done': false
                    }
                }
            }

            return users[id]
        }
    },
}
