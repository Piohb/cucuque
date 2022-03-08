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

    //=== SOCKET USER MODEL
    //  id
    //  username
    //  profile_pic
    //  score
    //  answer
    socket:{
        findOrCreate: async function(id, user){
            if ( !(id in users) ) {
                users[id] = {
                    'username': user.username,
                    'profile_pic' : user.profile_pic,
                    'score': 0,
                    'answer': null
                }
            }

            return users[id]
        }
    },
}
