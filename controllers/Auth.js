const UserController = require('../controllers/User')
const Crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv/config")

module.exports = {

    register: async function (data){
        try {
            data.password = await this.hashPassword(data.password)
            data.token = Crypto.randomBytes(64).toString('hex')
            return await UserController.create(data)
        } catch (err){
            throw new Error(err)
        }
    },

    generateToken : function (user){
        return jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, { expiresIn: `${process.env.TOKEN_EXPIRATION}s` })
    },

    hashPassword: async function (password){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    },

    comparePassword: async function(pwd, password){
        return await bcrypt.compare(pwd, password)
    },

    emailExists : async function(email){
        return await UserController.findUserByEmail(email)
    },

}
