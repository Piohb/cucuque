const express = require('express')
const router = express.Router()
const UserController = require('../controllers/User')

// get All users
router.get("/",async(req,res) => {
    const users = await UserController.getUsers()
    res.status(200).json(users)
})

// create one user
router.post("/", async (req, res) => {
    try {
        const user = await UserController.create(req.body)
        //console.log(user)
        if (!user) {
            return res.status(400).json({message: "wrong"})
        }

        return res.status(200).json(user)

    } catch (e) {
        res.status(400).json({message: e})
    }
})

module.exports = router