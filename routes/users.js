const express = require('express')
const router = express.Router()
const UserController = require('../controllers/User')
const { certificateAccess } = require("../validation/auth")

// get All users
router.get("/", certificateAccess(), async(req,res) => {
    const users = await UserController.getUsers()
    res.status(200).json(users)
})

router.get("/:email",async(req,res) => {
    let user = await UserController.findUserByEmail(req.params.email, true)
    res.status(200).json(user)
})

// create one user
router.post("/", certificateAccess(), async (req, res) => {
    try {
        const user = await UserController.create(req.body)
        if (!user) { return res.status(400).json({message: "wrong"}) }
        return res.status(200).json(user)
    } catch (e) {
        res.status(400).json({message: e})
    }
})

// update user
router.put("/:id", certificateAccess(), async (req, res) => {
    try {
        let user = await UserController.findUserByEmail(req.params.email, true)
        user = await UserController.update(user, req.body)
        return res.status(200).json(user)
    } catch (e) {
        res.status(400).json({message: e})
    }
})

module.exports = router